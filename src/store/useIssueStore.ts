import { create } from "zustand";
import { Issue, IssuePriority, IssueStatus } from "../types";
import { mockFetchIssues } from "../utils/api";

export interface IssueFilters {
  searchTerm: string;
  assignee: string;
  priority: IssuePriority | "all";
}

interface UndoState {
  issueId: string;
  fromStatus: IssueStatus;
  newStatus: IssueStatus;
  timerId: NodeJS.Timeout;
  message: string;
}

interface IssueStoreState {
  issues: Issue[];
  isLoading: boolean;
  error: string | null;
  filters: IssueFilters;
  assignees: string[];
  undoState: UndoState | null;
  lastSync: Date | null; // <-- 1. Add lastSync to state

  fetchIssues: () => Promise<void>;
  setFilters: (newFilters: Partial<IssueFilters>) => void;
  moveIssue: (issueId: string, newStatus: IssueStatus) => void;
  undoMove: () => void;
}

export const useIssueStore = create<IssueStoreState>((set, get) => ({
  issues: [],
  isLoading: false,
  error: null,
  lastSync: null,
  filters: {
    searchTerm: "",
    assignee: "all",
    priority: "all",
  },
  assignees: [],
  undoState: null,

  fetchIssues: async () => {
    set({ error: null });

    try {
      const fetchedIssues = (await mockFetchIssues()) as Issue[];
      const allAssignees = fetchedIssues.map((issue) => issue.assignee);
      const uniqueAssignees = Array.from(new Set(allAssignees));

      set({
        issues: fetchedIssues,
        assignees: uniqueAssignees,
        lastSync: new Date(),
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch issues";

      if (!get().lastSync) {
        set({ error: errorMsg, isLoading: false });
      } else {
        console.error("Polling fetch failed:", errorMsg);
      }
    }
  },

  setFilters: (newFilters: Partial<IssueFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  moveIssue: (issueId: string, newStatus: IssueStatus) => {
    const { issues, undoState } = get();

    if (undoState) {
      clearTimeout(undoState.timerId);
    }

    const issueToMove = issues.find((i) => i.id === issueId);
    if (!issueToMove) return;

    const fromStatus = issueToMove.status;

    const newIssues = issues.map((i) =>
      i.id === issueId ? { ...i, status: newStatus } : i
    );

    const newTimerId = setTimeout(() => {
      set({ undoState: null });
    }, 5000);

    set({
      issues: newIssues,
      undoState: {
        issueId,
        fromStatus,
        newStatus,
        timerId: newTimerId,
        message: `Moved "${issueToMove.title.substring(
          0,
          20
        )}..." to ${newStatus}`,
      },
    });
  },

  undoMove: () => {
    const { issues, undoState } = get();
    if (!undoState) return;

    const { issueId, fromStatus, timerId } = undoState;

    clearTimeout(timerId);

    const revertedIssues = issues.map((i) =>
      i.id === issueId ? { ...i, status: fromStatus } : i
    );

    set({
      issues: revertedIssues,
      undoState: null,
    });
  },
}));

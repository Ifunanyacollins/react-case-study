import { create } from "zustand";
import { Issue, IssuePriority, IssueStatus } from "../types";
import { mockFetchIssues, mockUpdateIssue } from "../utils/api";

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
  previousIssues: Issue[];
}
interface IssueStoreState {
  issues: Issue[];
  isLoading: boolean;
  error: string | null;
  filters: IssueFilters;
  assignees: string[];
  undoState: UndoState | null;
  lastSync: Date | null;

  fetchIssues: () => Promise<void>;
  setFilters: (newFilters: Partial<IssueFilters>) => void;
  moveIssue: (issueId: string, newStatus: IssueStatus) => void;
  undoMove: () => void;
}

export const useIssueStore = create<IssueStoreState>((set, get) => ({
  issues: [],
  isLoading: false,
  error: null,
  filters: { searchTerm: "", assignee: "all", priority: "all" },
  assignees: [],
  undoState: null,
  lastSync: null,

  fetchIssues: async () => {
    if (get().undoState) {
      return;
    }

    const isInitialFetch = get().lastSync === null;
    if (isInitialFetch) {
      set({ isLoading: true, error: null });
    } else {
      set({ error: null });
    }

    try {
      const fetchedIssues = (await mockFetchIssues()) as Issue[];
      const allAssignees = fetchedIssues.map((issue) => issue.assignee);
      const uniqueAssignees = Array.from(new Set(allAssignees));

      set({
        issues: fetchedIssues,
        assignees: uniqueAssignees,
        lastSync: new Date(),
        isLoading: false,
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch issues";
      set({ error: errorMsg, isLoading: false });
    }
  },

  setFilters: (newFilters: Partial<IssueFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  moveIssue: (issueId: string, newStatus: IssueStatus) => {
    const { issues, undoState } = get();
    if (undoState) clearTimeout(undoState.timerId);

    const issueToMove = issues.find((i) => i.id === issueId);
    if (!issueToMove || issueToMove.status === newStatus) return;

    const fromStatus = issueToMove.status;
    const previousIssues = issues;

    const newIssues = issues.map((i) =>
      i.id === issueId ? { ...i, status: newStatus } : i
    );

    const newTimerId = setTimeout(() => {
      set({ undoState: null });

      mockUpdateIssue(issueId, { status: newStatus }).catch((err) => {
        set({
          error: `Failed to move "${issueToMove.title}". Reverting.`,
          issues: previousIssues,
        });
      });
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
        previousIssues: previousIssues,
      },
    });
  },

  undoMove: () => {
    const { undoState } = get();
    if (!undoState) return;

    clearTimeout(undoState.timerId);
    set({
      issues: undoState.previousIssues,
      undoState: null,
    });
  },
}));

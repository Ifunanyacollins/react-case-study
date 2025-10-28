import { create } from "zustand";
import { Issue } from "../types";
import { mockFetchIssues } from "../utils/api";

interface IssueStoreState {
  issues: Issue[];
  isLoading: boolean;
  error: string | null;
  fetchIssues: () => Promise<void>;
}

export const useIssueStore = create<IssueStoreState>((set) => ({
  issues: [],
  isLoading: false,
  error: null,

  fetchIssues: async () => {
    set({ isLoading: true, error: null });
    try {
      const fetchedIssues = (await mockFetchIssues()) as Issue[];
      set({ issues: fetchedIssues, isLoading: false });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch issues";
      set({ error: errorMsg, isLoading: false });
    }
  },
}));

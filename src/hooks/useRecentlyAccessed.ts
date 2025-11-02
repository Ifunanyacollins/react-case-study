import { create } from "zustand";
import { getStorageItem, setStorageItem } from "../utils/localStorage";

const RECENT_ISSUES_KEY = "recentIssues";
const MAX_RECENT_ISSUES = 3;

export interface RecentlyAccessedIssue {
  id: string;
  title: string;
}

interface RecentlyAccessedState {
  recentlyAccessed: RecentlyAccessedIssue[];
  load: () => void;
  accessIssue: (id: string, title: string) => void;
}

export const useRecentlyAccessed = create<RecentlyAccessedState>(
  (set, get) => ({
    recentlyAccessed: [],

    load: () => {
      const loadedIssues =
        getStorageItem<RecentlyAccessedIssue[]>(RECENT_ISSUES_KEY);
      if (loadedIssues) {
        set({ recentlyAccessed: loadedIssues });
      }
    },

    accessIssue: (id: string, title: string) => {
      const { recentlyAccessed } = get();

      const filteredList = recentlyAccessed.filter((issue) => issue.id !== id);

      const newList = [{ id, title }, ...filteredList];

      const finalList = newList.slice(0, MAX_RECENT_ISSUES);

      set({ recentlyAccessed: finalList });
      setStorageItem(RECENT_ISSUES_KEY, finalList);
    },
  })
);

// Immediately load the list from localStorage when the app starts
useRecentlyAccessed.getState().load();

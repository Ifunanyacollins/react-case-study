import issuesData from "../data/issues.json";
import { Issue, IssueStatus } from "../types"; // <-- Import IssueStatus

// The key for our persistent "mock database"
const DB_KEY = "mock-issue-db";

// Simulate a network delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Gets the current issue list from localStorage.
 * If localStorage is empty, it seeds it from the JSON file.
 */
const getIssuesFromStorage = (): Issue[] => {
  let db = localStorage.getItem(DB_KEY);
  if (!db) {
    // --- THIS IS THE FIX ---
    // issuesData is the array, not an object containing .issues
    localStorage.setItem(DB_KEY, JSON.stringify(issuesData));
    return issuesData as Issue[];
    // --- END FIX ---
  }
  return JSON.parse(db) as Issue[];
};

/**
 * Saves an updated issue list to localStorage.
 */
const saveIssuesToStorage = (issues: Issue[]): void => {
  localStorage.setItem(DB_KEY, JSON.stringify(issues));
};

/**
 * Mocks a network request to fetch all issues.
 * (Now reads from localStorage)
 */
export const mockFetchIssues = async (): Promise<Issue[]> => {
  await delay(500);
  const issues = getIssuesFromStorage();
  return issues;
};

/**
 * Mocks a network request to update an issue.
 * (Now reads, modifies, and writes to localStorage)
 */
export const mockUpdateIssue = async (
  issueId: string,
  update: { status?: IssueStatus } // Use the imported IssueStatus type
): Promise<{ success: boolean; id: string }> => {
  await delay(500);

  let issues = getIssuesFromStorage();

  const issueIndex = issues.findIndex((i) => i.id === issueId);
  if (issueIndex === -1) {
    throw new Error("Issue not found");
  }

  // Apply the update
  issues[issueIndex] = { ...issues[issueIndex], ...update };

  // Save the new state back to our "DB"
  saveIssuesToStorage(issues);

  return { success: true, id: issueId };
};

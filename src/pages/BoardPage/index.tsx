import React, { useEffect, useMemo } from "react";
import { useIssueStore } from "../../store/useIssueStore";
import { FilterBar } from "../../components/FilterBar";
import { sortIssues } from "../../utils/sorting";
import { Issue, IssueStatus } from "../../types";
import { Board } from "../../components/Board";
import { UndoBar } from "../../components/UndoBar";
import styles from "./boardPage.module.css";

export const BoardPage = () => {
  const { moveIssue } = useIssueStore.getState();

  const issues = useIssueStore((state) => state.issues);
  const isLoading = useIssueStore((state) => state.isLoading);
  const error = useIssueStore((state) => state.error);
  const filters = useIssueStore((state) => state.filters);
  const fetchIssues = useIssueStore((state) => state.fetchIssues);
  const lastSync = useIssueStore((state) => state.lastSync);

  const handleMove = (issueId: string, newStatus: IssueStatus) => {
    moveIssue(issueId, newStatus);
  };

  useEffect(() => {
    if (issues.length === 0) {
      fetchIssues();
    }
  }, [fetchIssues, issues.length]);

  const filteredAndSortedIssues = useMemo(() => {
    const { searchTerm, assignee, priority } = filters;
    const filtered = issues.filter((issue: Issue) => {
      const termLower = searchTerm.toLowerCase();
      const matchesTerm =
        issue.title.toLowerCase().includes(termLower) ||
        issue.tags.some((tag) => tag.toLowerCase().includes(termLower));
      const matchesAssignee = assignee === "all" || issue.assignee === assignee;
      const matchesPriority = priority === "all" || issue.priority === priority;
      return matchesTerm && matchesAssignee && matchesPriority;
    });
    return filtered.sort(sortIssues);
  }, [issues, filters]);

  const columns = useMemo(() => {
    const backlog = filteredAndSortedIssues.filter(
      (issue) => issue.status === "Backlog"
    );
    const inProgress = filteredAndSortedIssues.filter(
      (issue) => issue.status === "In Progress"
    );
    const done = filteredAndSortedIssues.filter(
      (issue) => issue.status === "Done"
    );
    return { backlog, inProgress, done };
  }, [filteredAndSortedIssues]);

  const syncTime = useMemo(() => {
    if (!lastSync) {
      return "Never";
    }

    return lastSync.toLocaleString();
  }, [lastSync]);

  if (isLoading && !lastSync) {
    return (
      <div className={`${styles.pageWrapper} ${styles.loading}`}>
        Loading issues...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.pageWrapper} ${styles.error}`}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <h1>Issue Board</h1>
        <div className={styles.syncStatus}>Last Sync: {syncTime}</div>
      </div>

      <FilterBar />

      <Board>
        <Board.Column
          title="Backlog"
          status="Backlog"
          issues={columns.backlog}
          onMove={handleMove}
        />
        <Board.Column
          title="In Progress"
          status="In Progress"
          issues={columns.inProgress}
          onMove={handleMove}
        />
        <Board.Column
          title="Done"
          status="Done"
          issues={columns.done}
          onMove={handleMove}
        />
      </Board>

      <UndoBar />
    </div>
  );
};

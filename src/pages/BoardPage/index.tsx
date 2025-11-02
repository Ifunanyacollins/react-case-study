import React, { useEffect, useMemo, useState } from "react";
import { useIssueStore } from "../../store/useIssueStore";
import { FilterBar } from "../../components/FilterBar";
import { Board } from "../../components/Board";
import { UndoBar } from "../../components/UndoBar";
import styles from "./boardPage.module.css";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { Issue, IssueStatus } from "../../types";
import { sortIssues } from "../../utils/sorting";
import { IssueCard } from "../../components/Board/issueCard";
import { BoardSkeleton } from "../../components/SkeletonLoader";

export const BoardPage = () => {
  const { moveIssue } = useIssueStore.getState();
  const issues = useIssueStore((state) => state.issues);
  const isLoading = useIssueStore((state) => state.isLoading);
  const error = useIssueStore((state) => state.error);
  const filters = useIssueStore((state) => state.filters);
  const fetchIssues = useIssueStore((state) => state.fetchIssues);
  const lastSync = useIssueStore((state) => state.lastSync);

  const [activeId, setActiveId] = useState<string | null>(null);

  const activeIssue = useMemo(
    () => issues.find((issue) => issue.id === activeId),
    [activeId, issues]
  );

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
    if (!lastSync) return "Never";
    return lastSync.toLocaleString();
  }, [lastSync]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || !active) return;
    if (active.id === over.id) return;

    const issueId = active.id as string;
    const newStatus = over.id as IssueStatus;

    moveIssue(issueId, newStatus);
  };

  if (isLoading && !lastSync) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.header}>
          <h1>Issue Board</h1>
          <div className={styles.syncStatus}>Last Sync: Never</div>
        </div>

        <FilterBar />

        <BoardSkeleton />
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
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
          />
          <Board.Column
            title="In Progress"
            status="In Progress"
            issues={columns.inProgress}
          />
          <Board.Column title="Done" status="Done" issues={columns.done} />
        </Board>

        <UndoBar />

        <DragOverlay>
          {activeIssue ? (
            <IssueCard issue={activeIssue} isOverlay={true} />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

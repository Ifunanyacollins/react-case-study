import React from "react";
import { Issue, IssueStatus } from "../../types";
import styles from "./board.module.css";
import { IssueCard } from "./issueCard";

interface BoardColumnProps {
  title: string;
  status: IssueStatus;
  issues: Issue[];
  onMove: (issueId: string, newStatus: IssueStatus) => void;
}

export const BoardColumn = ({
  title,
  status,
  issues,
  onMove,
}: BoardColumnProps) => {
  const issueCount = issues.length;

  return (
    <div className={styles.columnWrapper}>
      <div className={styles.columnHeader}>
        {title} ({issueCount})
      </div>
      <div className={styles.columnBody}>
        {issueCount > 0 ? (
          issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onMove={onMove} />
          ))
        ) : (
          <p className={styles.emptyMessage}>No issues</p>
        )}
      </div>
    </div>
  );
};

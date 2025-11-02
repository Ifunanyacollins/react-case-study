import React from "react";
import { Issue, IssueStatus } from "../../types";
import styles from "./board.module.css";
import { IssueCard } from "./issueCard";
import { useDroppable } from "@dnd-kit/core";

interface BoardColumnProps {
  title: string;
  status: IssueStatus;
  issues: Issue[];
}

export const BoardColumn = ({ title, status, issues }: BoardColumnProps) => {
  const issueCount = issues.length;
  const headerId = `col-header-${status.replace(/\s+/g, "-")}`;

  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <section
      ref={setNodeRef}
      className={styles.columnWrapper}
      aria-labelledby={headerId}
    >
      <div className={styles.columnHeader} id={headerId}>
        {title} ({issueCount})
      </div>
      <div className={styles.columnBody}>
        {issueCount > 0 ? (
          issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)
        ) : (
          <p className={styles.emptyMessage}>No issues</p>
        )}
      </div>
    </section>
  );
};

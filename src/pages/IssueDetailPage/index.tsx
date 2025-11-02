// src/pages/IssueDetailPage/index.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useIssueStore } from "../../store/useIssueStore";
import { useAuth } from "../../context/UserContext";
import { useRecentlyAccessed } from "../../hooks/useRecentlyAccessed";
import styles from "./issueDetailPage.module.css";
import dayjs from "dayjs";

export const IssueDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { isAdmin } = useAuth();
  const { moveIssue } = useIssueStore.getState();
  const accessIssue = useRecentlyAccessed((state) => state.accessIssue);

  const issue = useIssueStore((state) => state.issues.find((i) => i.id === id));

  useEffect(() => {
    if (issue) {
      accessIssue(issue.id, issue.title);
    }
  }, [issue?.id, issue, accessIssue]);

  const handleResolve = () => {
    if (issue && issue.status !== "Done") {
      moveIssue(issue.id, "Done");
      navigate("/board");
    }
  };

  if (!issue) {
    return <div className={styles.loading}>Loading issue or not found...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>{issue.title}</h1>
        {isAdmin && issue.status !== "Done" && (
          <button className={styles.resolveButton} onClick={handleResolve}>
            Mark as Resolved
          </button>
        )}
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <strong>Status</strong>
          {issue.status}
        </div>
        <div className={styles.detailItem}>
          <strong>Priority</strong>
          {issue.priority}
        </div>
        <div className={styles.detailItem}>
          <strong>Severity</strong>
          {issue.severity}
        </div>
        <div className={styles.detailItem}>
          <strong>Assignee</strong>
          {issue.assignee}
        </div>
        <div className={styles.detailItem}>
          <strong>Created</strong>
          {dayjs(issue.createdAt).format("MMMM D, YYYY")}
        </div>
        <div className={styles.detailItem}>
          <strong>Tags</strong>
          {issue.tags.join(", ")}
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { Issue, IssueStatus } from "../../types";
import dayjs from "dayjs";
import styles from "./board.module.css";
import { useAuth } from "../../context/UserContext";

const getPossibleActions = (status: IssueStatus) => {
  switch (status) {
    case "Backlog":
      return [{ label: "Start >", newStatus: "In Progress" as IssueStatus }];
    case "In Progress":
      return [
        { label: "< Backlog", newStatus: "Backlog" as IssueStatus },
        { label: "Done >", newStatus: "Done" as IssueStatus },
      ];
    case "Done":
      return [{ label: "< Re-open", newStatus: "In Progress" as IssueStatus }];
    default:
      return [];
  }
};

interface IssueCardProps {
  issue: Issue;
  onMove: (issueId: string, newStatus: IssueStatus) => void;
}

export const IssueCard = ({ issue, onMove }: IssueCardProps) => {
  const { isAdmin } = useAuth();
  const possibleActions = getPossibleActions(issue.status);
  const createdDate = dayjs(issue.createdAt).format("MMM D");

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>{issue.title}</div>
      <p>
        <strong>Priority:</strong> {issue.priority} | <strong>Severity:</strong>{" "}
        {issue.severity}
      </p>
      <p>
        <strong>Tags:</strong> {issue.tags.join(", ")}
      </p>

      <div className={styles.cardFooter}>
        <span>
          {issue.assignee} (Added: {createdDate})
        </span>
        <div className={styles.buttonGroup}>
          {isAdmin &&
            possibleActions.map((action) => (
              <button
                key={action.newStatus}
                className={styles.moveButton}
                onClick={() => onMove(issue.id, action.newStatus)}
              >
                {action.label}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

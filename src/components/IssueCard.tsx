import React from "react";
import { Issue, IssueStatus } from "../types";
import dayjs from "dayjs";

// Minimal styling for the card
const cardStyle: React.CSSProperties = {
  padding: "1rem",
  border: "1px solid #ccc",
  borderRadius: "4px",
  marginBottom: "0.5rem",
  background: "#fff",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const cardHeaderStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "0.5rem",
};

const cardFooterStyle: React.CSSProperties = {
  marginTop: "1rem",
  fontSize: "12px",
  color: "#555",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: "0.5rem",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.25rem 0.5rem",
  fontSize: "12px",
};

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
  const possibleActions = getPossibleActions(issue.status);
  const createdDate = dayjs(issue.createdAt).format("MMM D");

  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}>{issue.title}</div>
      <p>
        <strong>Priority:</strong> {issue.priority} | <strong>Severity:</strong>{" "}
        {issue.severity}
      </p>
      <p>
        <strong>Tags:</strong> {issue.tags.join(", ")}
      </p>

      <div style={cardFooterStyle}>
        <span>
          {issue.assignee} (Added: {createdDate})
        </span>
        <div style={buttonGroupStyle}>
          {possibleActions.map((action) => (
            <button
              key={action.newStatus}
              style={buttonStyle}
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

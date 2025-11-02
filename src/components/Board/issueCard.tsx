import React from "react";
import { useNavigate } from "react-router-dom";
import { Issue } from "../../types";
import dayjs from "dayjs";
import styles from "./board.module.css";
import { useAuth } from "../../context/UserContext";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface IssueCardProps {
  issue: Issue;
  isOverlay?: boolean;
}

export const IssueCard = ({ issue, isOverlay = false }: IssueCardProps) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const createdDate = dayjs(issue.createdAt).format("MMM D");

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: issue.id,
      data: { status: issue.status },
      disabled: !isAdmin,
    });

  const style: React.CSSProperties = {
    transform: isOverlay ? undefined : CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1,
    zIndex: isDragging ? 0 : "auto",
    cursor: isOverlay ? "grabbing" : "pointer",
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "high":
        return styles.high;
      case "medium":
        return styles.medium;
      case "low":
        return styles.low;
      default:
        return "";
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    navigate(`/issue/${issue.id}`);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`${styles.card} ${isOverlay ? styles.dragging : ""}`}
      onClick={handleClick}
    >
      {isAdmin && (
        <div {...listeners} className={styles.dragHandle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide-grip"
          >
            <circle cx="12" cy="5" r="1" />
            <circle cx="19" cy="5" r="1" />
            <circle cx="5" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
            <circle cx="19" cy="19" r="1" />
            <circle cx="5" cy="19" r="1" />
          </svg>
        </div>
      )}

      <div className={styles.cardHeader}>{issue.title}</div>

      <div className={styles.cardMeta}>
        <span
          className={`${styles.priority} ${getPriorityClass(issue.priority)}`}
        >
          {issue.priority}
        </span>
        {issue.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className={styles.cardFooter}>
        <span>{issue.assignee}</span>
        <span>Added: {createdDate}</span>
      </div>
    </div>
  );
};

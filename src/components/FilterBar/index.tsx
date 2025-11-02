import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useIssueStore } from "../../store/useIssueStore";
import { IssuePriority } from "../../types";
import styles from "./filterBar.module.css";
import { useRecentlyAccessed } from "../../hooks/useRecentlyAccessed";
import { Modal } from "../Modal";

export const FilterBar = () => {
  const { filters, setFilters, assignees } = useIssueStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const recentlyAccessed = useRecentlyAccessed(
    (state) => state.recentlyAccessed
  );

  const priorities: (IssuePriority | "all")[] = [
    "all",
    "low",
    "medium",
    "high",
  ];

  return (
    <>
      <div className={styles.filterBar}>
        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <label htmlFor="search">Search:</label>
            <input
              id="search"
              type="text"
              placeholder="Title or tag..."
              className={styles.input}
              value={filters.searchTerm}
              onChange={(e) => setFilters({ searchTerm: e.target.value })}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="assignee">Assignee:</label>
            <select
              id="assignee"
              className={styles.select}
              value={filters.assignee}
              onChange={(e) => setFilters({ assignee: e.target.value })}
            >
              <option value="all">All</option>
              {assignees.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              className={styles.select}
              value={filters.priority}
              onChange={(e) => setFilters({ priority: e.target.value as any })}
            >
              {priorities.map((p) => (
                <option
                  key={p}
                  value={p}
                  style={{ textTransform: "capitalize" }}
                >
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.recentButtonWrapper}>
          <button
            className={styles.recentButton}
            onClick={() => setIsModalOpen(true)}
          >
            Recently Viewed ({recentlyAccessed.length})
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Recently Viewed Issues"
      >
        <div className={styles.modalList}>
          {recentlyAccessed.length > 0 ? (
            recentlyAccessed.map((issue) => (
              <Link
                key={issue.id}
                to={`/issue/${issue.id}`}
                className={styles.modalCardLink}
                onClick={() => setIsModalOpen(false)}
              >
                {issue.title}
              </Link>
            ))
          ) : (
            <p>No recent issues.</p>
          )}
        </div>
      </Modal>
    </>
  );
};

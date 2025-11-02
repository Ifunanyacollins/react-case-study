import React from "react";
import { useIssueStore } from "../../store/useIssueStore";
import { IssuePriority } from "../../types";
import styles from "./filterBar.module.css";

export const FilterBar = () => {
  const { filters, setFilters, assignees } = useIssueStore();
  const priorities: (IssuePriority | "all")[] = [
    "all",
    "low",
    "medium",
    "high",
  ];

  return (
    <div className={styles.filterBar}>
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
            <option key={p} value={p} style={{ textTransform: "capitalize" }}>
              {p}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

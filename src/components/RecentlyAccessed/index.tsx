import React from "react";
import { Link } from "react-router-dom";
import { useRecentlyAccessed } from "../../hooks/useRecentlyAccessed";
import styles from "./recentlyAccessed.module.css";

export const RecentlyAccessed = () => {
  const recentlyAccessed = useRecentlyAccessed(
    (state) => state.recentlyAccessed
  );

  if (recentlyAccessed.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Recently Viewed</h3>
      <div className={styles.list}>
        {recentlyAccessed.map((issue) => (
          <Link
            key={issue.id}
            to={`/issue/${issue.id}`}
            className={styles.card}
          >
            {issue.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

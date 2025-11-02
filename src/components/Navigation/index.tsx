import { Link } from "react-router-dom";
import { useRecentlyAccessed } from "../../hooks/useRecentlyAccessed";
import styles from "./navigation.module.css";

export const Navigation = () => {
  const recentlyAccessed = useRecentlyAccessed(
    (state) => state.recentlyAccessed
  );

  return (
    <nav className={styles.nav}>
      <div className={styles.mainLinks}>
        <Link to="/board" className={styles.navLink}>
          Board
        </Link>
        <Link to="/settings" className={styles.navLink}>
          Settings
        </Link>
      </div>

      <div className={styles.recentLinks}>
        <span className={styles.recentTitle}>Recent:</span>
        {recentlyAccessed.length > 0 ? (
          recentlyAccessed.map((issue) => (
            <Link
              key={issue.id}
              to={`/issue/${issue.id}`}
              className={styles.recentLink}
              title={issue.title}
            >
              {issue.title.substring(0, 15)}...
            </Link>
          ))
        ) : (
          <span style={{ fontSize: "14px", color: "#888" }}>
            No recent issues
          </span>
        )}
      </div>
    </nav>
  );
};

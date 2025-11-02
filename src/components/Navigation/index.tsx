import { NavLink } from "react-router-dom";
import styles from "./navigation.module.css";
import { ThemeToggle } from "../ThemeToggle";

export const Navigation = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.mainLinks}>
        <NavLink
          to="/board"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          Board
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          Settings
        </NavLink>
      </div>

      <div className={styles.themeToggleWrapper}>
        <ThemeToggle />
      </div>
    </nav>
  );
};

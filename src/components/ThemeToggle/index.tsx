import { useEffect, useState } from "react";
import styles from "./themeToggle.module.css";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const isDarkMode =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkMode);
    applyTheme(isDarkMode);
  }, []);

  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleToggle = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
    applyTheme(newIsDark);
  };

  if (!mounted) {
    return <div className={styles.placeholder} />;
  }

  return (
    <button
      onClick={handleToggle}
      className={styles.toggleButton}
      aria-label="Toggle dark mode"
    >
      <div
        className={styles.toggleCircle}
        style={{
          transform: isDark ? "translateX(32px)" : "translateX(2px)",
        }}
      />

      <div
        className={styles.lightIndicator}
        style={{ opacity: isDark ? 0.4 : 1 }}
      >
        <div className={styles.lightIcon} />
      </div>

      <div
        className={styles.darkIndicator}
        style={{ opacity: isDark ? 1 : 0.4 }}
      >
        <div className={styles.darkIcon} />
      </div>
    </button>
  );
}

import React from "react";
import { usePolling } from "../../context/PollingContext";
import styles from "./settingsPage.module.css";

export const SettingsPage = () => {
  const { intervalMs, setIntervalMs } = usePolling();

  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const newInterval = value === "null" ? null : Number(value);
    setIntervalMs(newInterval);
  };

  return (
    <div className={styles.pageWrapper}>
      <h2>Settings</h2>

      <div className={styles.settingBlock}>
        <strong>Real-time Updates</strong>
        <p>Set polling frequency to automatically sync issues.</p>
        <select
          className={styles.select}
          value={String(intervalMs)}
          onChange={handleIntervalChange}
        >
          <option value="null">Off</option>
          <option value="5000">Every 5 seconds</option>
          <option value="10000">Every 10 seconds</option>
          <option value="30000">Every 30 seconds</option>
        </select>
      </div>
    </div>
  );
};

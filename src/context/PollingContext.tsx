import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { getStorageItem, setStorageItem } from "../utils/localStorage";
import { useIssueStore } from "../store/useIssueStore";

type Interval = number | null;
const POLLING_KEY = "app-polling-interval";

interface PollingContextType {
  intervalMs: Interval;
  setIntervalMs: (ms: Interval) => void;
}

const PollingContext = createContext<PollingContextType | undefined>(undefined);

export const PollingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [intervalMs, setIntervalMs] = useState<Interval>(() => {
    return getStorageItem<Interval>(POLLING_KEY) || null;
  });

  const { fetchIssues } = useIssueStore.getState();

  useEffect(() => {
    setStorageItem(POLLING_KEY, intervalMs);

    if (intervalMs !== null) {
      const timerId = setInterval(() => {
        console.log(`Polling for issues... (Interval: ${intervalMs}ms)`);
        fetchIssues();
      }, intervalMs);

      return () => clearInterval(timerId);
    }
  }, [intervalMs, fetchIssues]);

  const value = useMemo(
    () => ({
      intervalMs,
      setIntervalMs,
    }),
    [intervalMs]
  );

  return (
    <PollingContext.Provider value={value}>{children}</PollingContext.Provider>
  );
};

export const usePolling = () => {
  const context = useContext(PollingContext);
  if (context === undefined) {
    throw new Error("usePolling must be used within a PollingProvider");
  }
  return context;
};

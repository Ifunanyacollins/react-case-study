import React from "react";
import { useIssueStore } from "../../store/useIssueStore";
import styles from "./undoBar.module.css";

export const UndoBar = () => {
  const undoState = useIssueStore((state) => state.undoState);
  const undoMove = useIssueStore((state) => state.undoMove);

  if (!undoState) {
    return null;
  }

  return (
    <div className={styles.undoBar}>
      <span className={styles.message}>{undoState.message}</span>
      <button className={styles.undoButton} onClick={undoMove}>
        Undo
      </button>
    </div>
  );
};

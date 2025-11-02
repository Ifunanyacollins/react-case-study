import React from "react";
import styles from "./board.module.css";

const Board = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.boardContainer}>{children}</div>;
};

export default Board;

import styles from "./skeleton.module.css";
import boardStyles from "../Board/board.module.css";

const SkeletonCard = () => (
  <div className={styles.skeletonCard}>
    <div className={`${styles.skeleton} ${styles.header}`}></div>
    <div className={`${styles.skeleton} ${styles.meta}`}></div>
    <div className={`${styles.skeleton} ${styles.footer}`}></div>
  </div>
);

const SkeletonColumn = () => (
  <section className={boardStyles.columnWrapper}>
    <div className={boardStyles.columnHeader}>
      <div className={`${styles.skeleton} ${styles.columnTitle}`}></div>
    </div>

    <div className={boardStyles.columnBody}>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </section>
);

export const BoardSkeleton = () => {
  return (
    <div className={boardStyles.boardContainer}>
      <SkeletonColumn />
      <SkeletonColumn />
      <SkeletonColumn />
    </div>
  );
};

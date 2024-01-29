import React from "react";
import styles from "./skeleton.module.css";

export function SkeletonList() {
  return (
    <div className={styles.list}>
      {Array.from(Array(20).keys()).map((el) => (
        <div className={styles.listItem} key={`skeleton-${el}`} />
      ))}
    </div>
  );
}

export function BigSkeleton() {
  return <div className={styles.bigItem} />;
}

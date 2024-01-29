import React from "react";
import styles from "./notFound.module.css";

export function NotFound() {
  return (
    <main className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.imgWrapper}>
          <span>404</span>
        </div>
        <h1>Oops! Try searching in a different universe</h1>
      </div>
    </main>
  );
}

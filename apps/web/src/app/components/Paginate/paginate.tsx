import React from "react";
import { Button } from "../button/button.tsx";
import styles from "./paginate.module.css";

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};
const DOTS = "...";

const calculatePages = (
  page: number,
  totalPageCount: number,
  siblingCount = 3,
): number[] => {
  const totalPageNumbers = siblingCount + 5;

  if (totalPageNumbers >= totalPageCount) {
    return range(1, totalPageCount);
  }

  const leftSiblingIndex = Math.max(page - siblingCount, 1);
  const rightSiblingIndex = Math.min(page + siblingCount, totalPageCount);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPageCount;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = range(1, leftItemCount);

    return [...leftRange, -1, totalPageCount];
  } else if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = range(
      totalPageCount - rightItemCount + 1,
      totalPageCount,
    );
    return [firstPageIndex, -1, ...rightRange];
  }
  const middleRange = range(leftSiblingIndex, rightSiblingIndex);
  return [firstPageIndex, -1, ...middleRange, -1, lastPageIndex];
};

export function Paginate({
  totalPages,
  handleClick,
  page,
}: {
  totalPages: number;
  handleClick: (selectedPage: number) => void;
  page: number;
}) {
  const pages = calculatePages(page, totalPages);
  return (
    <div className={styles.container}>
      {pages.map((num) =>
        num !== -1 ? (
          <Button
            key={num}
            onClick={() => {
              handleClick(num);
            }}
            variant={num === page ? "primary" : "clear"}
          >
            {num}
          </Button>
        ) : (
          <span className={styles.dots} key={num}>
            &#8230;
          </span>
        ),
      )}
    </div>
  );
}

import type { ButtonHTMLAttributes } from "react";
import React from "react";
import clsx from "clsx";
import styles from "./button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "clear";
}

export function Button(props: ButtonProps) {
  const { variant = "primary", children, ...rest } = props;
  return (
    <button
      className={clsx(styles.button, {
        [styles.primary]: variant === "primary",
        [styles.clear]: variant === "clear",
      })}
      {...rest}
    >
      {children}
    </button>
  );
}

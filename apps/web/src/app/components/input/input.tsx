import React, { forwardRef, InputHTMLAttributes } from "react";
import styles from "./input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (props: InputProps, ref) => {
    return (
      <div className={styles.input}>
        <label>{props.label}</label>
        <input {...props} ref={ref} />
        {props.error ? <div className={styles.error}>{props.error}</div> : null}
      </div>
    );
  },
);

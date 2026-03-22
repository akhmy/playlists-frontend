import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./SignForm.module.css";

interface SignFormProps {
  title: string;
  hint: ReactNode;
  onSubmit: () => void;
  submitLabel: string;
  children: ReactNode;
}

const SignFormRoot = ({ title, hint, onSubmit, submitLabel, children }: SignFormProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>{title}</h2>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {children}
          <button className={styles.submit} type="submit">
            {submitLabel}
          </button>
        </form>
        <p className={styles.hint}>{hint}</p>
      </div>
    </div>
  );
};

interface FieldProps {
  label: string;
  errors?: string[];
  children: ReactNode;
}

const Field = ({ label, errors, children }: FieldProps) => {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
      {errors?.map((e, i) => (
        <span key={i} className={styles.error}>
          {e}
        </span>
      ))}
    </div>
  );
};

const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return <input className={styles.input} {...props} />;
};

export const SignForm = Object.assign(SignFormRoot, { Field, Input });

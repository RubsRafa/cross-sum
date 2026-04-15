import styles from "./style.module.css";

interface ResultDisplayProps {
  value: number;
  direction: "row" | "column";
}

export function ResultDisplay({ value, direction }: ResultDisplayProps) {
  return (
    <div className={`${styles.result} ${styles[direction]}`}>
      <span className={styles.equals}>=</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

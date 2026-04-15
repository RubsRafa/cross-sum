import { Operation, formatOperation } from "@/src/services/puzzle-service";
import styles from "./style.module.css";

interface OperationDisplayProps {
  operation: Operation;
  direction: "horizontal" | "vertical";
}

export function OperationDisplay({
  operation,
  direction,
}: OperationDisplayProps) {
  return (
    <div className={`${styles.operation} ${styles[direction]}`}>
      {formatOperation(operation)}
    </div>
  );
}

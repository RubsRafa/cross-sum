"use client";

import styles from "./style.module.css";

interface CellProps {
  value: number | null;
  notes: number[];
  isSelected: boolean;
  isError: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export function Cell({
  value,
  notes,
  isSelected,
  isError,
  onClick,
  onContextMenu,
}: CellProps) {
  return (
    <div
      className={`${styles.cell} ${isSelected ? styles.selected : ""} ${isError ? styles.error : ""}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {value !== null ? (
        <span className={styles.value}>{value}</span>
      ) : notes.length > 0 ? (
        <div className={styles.notes}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <span
              key={n}
              className={`${styles.note} ${notes.includes(n) ? styles.noteActive : ""}`}
            >
              {notes.includes(n) ? n : ""}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

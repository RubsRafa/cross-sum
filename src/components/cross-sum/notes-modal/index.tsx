"use client";

import { useEffect, useRef } from "react";
import styles from "./style.module.css";

interface NotesModalProps {
  isOpen: boolean;
  position: { x: number; y: number };
  currentNotes: number[];
  onToggleNote: (note: number) => void;
  onClose: () => void;
}

export function NotesModal({
  isOpen,
  position,
  currentNotes,
  onToggleNote,
  onClose,
}: NotesModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className={styles.modal}
      style={{ left: position.x, top: position.y }}
    >
      <div className={styles.title}>Rascunho</div>
      <div className={styles.grid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            className={`${styles.noteButton} ${currentNotes.includes(n) ? styles.active : ""}`}
            onClick={() => onToggleNote(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

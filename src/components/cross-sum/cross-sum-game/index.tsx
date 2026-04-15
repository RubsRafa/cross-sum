"use client";

import { useState, useEffect, useCallback } from "react";
import { GameBoard } from "../game-board";
import { NotesModal } from "../notes-modal";
import styles from "./style.module.css";
import {
  checkSolution,
  generatePuzzle,
  Puzzle,
} from "@/src/services/puzzle-service";

export function CrossSumGame() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [userNumbers, setUserNumbers] = useState<(number | null)[]>(
    Array(9).fill(null),
  );
  const [notes, setNotes] = useState<number[][]>(
    Array(9)
      .fill(null)
      .map(() => []),
  );
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [errorCells, setErrorCells] = useState<Set<number>>(new Set());
  const [isSolved, setIsSolved] = useState(false);
  const [notesModal, setNotesModal] = useState<{
    isOpen: boolean;
    cellIndex: number;
    position: { x: number; y: number };
  }>({
    isOpen: false,
    cellIndex: -1,
    position: { x: 0, y: 0 },
  });

  // Initialize puzzle
  useEffect(() => {
    setPuzzle(generatePuzzle());
  }, []);

  // Check for duplicate numbers and update error cells
  useEffect(() => {
    const newErrorCells = new Set<number>();
    const numberCounts: Map<number, number[]> = new Map();

    userNumbers.forEach((num, index) => {
      if (num !== null) {
        if (!numberCounts.has(num)) {
          numberCounts.set(num, []);
        }
        numberCounts.get(num)!.push(index);
      }
    });

    numberCounts.forEach((indices) => {
      if (indices.length > 1) {
        indices.forEach((index) => newErrorCells.add(index));
      }
    });

    setErrorCells(newErrorCells);
  }, [userNumbers]);

  // Check if puzzle is solved
  useEffect(() => {
    if (puzzle && !isSolved) {
      const solved = checkSolution(userNumbers, puzzle);
      if (solved) {
        setIsSolved(true);
      }
    }
  }, [userNumbers, puzzle, isSolved]);

  // Keyboard input handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedCell === null || isSolved) return;

      const key = e.key;

      if (key >= "1" && key <= "9") {
        const num = parseInt(key);
        setUserNumbers((prev) => {
          const newNumbers = [...prev];
          newNumbers[selectedCell] = num;
          return newNumbers;
        });
        // Clear notes when number is entered
        setNotes((prev) => {
          const newNotes = [...prev];
          newNotes[selectedCell] = [];
          return newNotes;
        });
      } else if (key === "Backspace" || key === "Delete" || key === "0") {
        setUserNumbers((prev) => {
          const newNumbers = [...prev];
          newNumbers[selectedCell] = null;
          return newNumbers;
        });
      } else if (key === "ArrowUp" && selectedCell >= 3) {
        setSelectedCell(selectedCell - 3);
      } else if (key === "ArrowDown" && selectedCell < 6) {
        setSelectedCell(selectedCell + 3);
      } else if (key === "ArrowLeft" && selectedCell % 3 !== 0) {
        setSelectedCell(selectedCell - 1);
      } else if (key === "ArrowRight" && selectedCell % 3 !== 2) {
        setSelectedCell(selectedCell + 1);
      }
    },
    [selectedCell, isSolved],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleCellClick = (index: number) => {
    if (!isSolved) {
      setSelectedCell(index);
    }
  };

  const handleCellContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    if (isSolved || userNumbers[index] !== null) return;

    setNotesModal({
      isOpen: true,
      cellIndex: index,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  const handleToggleNote = (note: number) => {
    setNotes((prev) => {
      const newNotes = [...prev];
      const cellNotes = [...newNotes[notesModal.cellIndex]];
      const noteIndex = cellNotes.indexOf(note);

      if (noteIndex === -1) {
        cellNotes.push(note);
      } else {
        cellNotes.splice(noteIndex, 1);
      }

      newNotes[notesModal.cellIndex] = cellNotes;
      return newNotes;
    });
  };

  const handleNewPuzzle = () => {
    setPuzzle(generatePuzzle());
    setUserNumbers(Array(9).fill(null));
    setNotes(
      Array(9)
        .fill(null)
        .map(() => []),
    );
    setSelectedCell(null);
    setErrorCells(new Set());
    setIsSolved(false);
  };

  const handleClear = () => {
    setUserNumbers(Array(9).fill(null));
    setNotes(
      Array(9)
        .fill(null)
        .map(() => []),
    );
    setSelectedCell(null);
    setIsSolved(false);
  };

  if (!puzzle) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>Gerando puzzle...</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Cross-Sum</h1>
      </header>

      <main className={styles.main}>
        {isSolved && (
          <div className={styles.solvedBanner}>
            <span className={styles.solvedText}>Puzzle resolvido!</span>
          </div>
        )}

        <div className={styles.gameArea}>
          <GameBoard
            puzzle={puzzle}
            userNumbers={userNumbers}
            notes={notes}
            selectedCell={selectedCell}
            errorCells={errorCells}
            onCellClick={handleCellClick}
            onCellContextMenu={handleCellContextMenu}
          />
        </div>

        <div className={styles.controls}>
          <button className={styles.button} onClick={handleNewPuzzle}>
            Novo Puzzle
          </button>
          <button
            className={`${styles.button} ${styles.secondary}`}
            onClick={handleClear}
          >
            Limpar
          </button>
        </div>

        <p className={styles.hint}>
          Clique em uma célula e digite um número de 1 a 9.
          <br />
          Clique direito para anotações.
        </p>
      </main>

      <NotesModal
        isOpen={notesModal.isOpen}
        position={notesModal.position}
        currentNotes={
          notesModal.cellIndex >= 0 ? notes[notesModal.cellIndex] : []
        }
        onToggleNote={handleToggleNote}
        onClose={() => setNotesModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

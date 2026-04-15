"use client";

import { Puzzle } from "@/src/services/puzzle-service";
import { Cell } from "../cell";
import { OperationDisplay } from "../operation-display";
import { ResultDisplay } from "../result-display";
import styles from "./style.module.css";

interface GameBoardProps {
  puzzle: Puzzle;
  userNumbers: (number | null)[];
  notes: number[][];
  selectedCell: number | null;
  errorCells: Set<number>;
  onCellClick: (index: number) => void;
  onCellContextMenu: (e: React.MouseEvent, index: number) => void;
}

export function GameBoard({
  puzzle,
  userNumbers,
  notes,
  selectedCell,
  errorCells,
  onCellClick,
  onCellContextMenu,
}: GameBoardProps) {
  const renderRow = (row: number) => (
    <div key={`row-${row}`} className={styles.row}>
      <Cell
        value={userNumbers[row * 3]}
        notes={notes[row * 3]}
        isSelected={selectedCell === row * 3}
        isError={errorCells.has(row * 3)}
        onClick={() => onCellClick(row * 3)}
        onContextMenu={(e) => onCellContextMenu(e, row * 3)}
      />
      <OperationDisplay
        operation={puzzle.rowOperations[row][0]}
        direction="horizontal"
      />
      <Cell
        value={userNumbers[row * 3 + 1]}
        notes={notes[row * 3 + 1]}
        isSelected={selectedCell === row * 3 + 1}
        isError={errorCells.has(row * 3 + 1)}
        onClick={() => onCellClick(row * 3 + 1)}
        onContextMenu={(e) => onCellContextMenu(e, row * 3 + 1)}
      />
      <OperationDisplay
        operation={puzzle.rowOperations[row][1]}
        direction="horizontal"
      />
      <Cell
        value={userNumbers[row * 3 + 2]}
        notes={notes[row * 3 + 2]}
        isSelected={selectedCell === row * 3 + 2}
        isError={errorCells.has(row * 3 + 2)}
        onClick={() => onCellClick(row * 3 + 2)}
        onContextMenu={(e) => onCellContextMenu(e, row * 3 + 2)}
      />
      <ResultDisplay value={puzzle.rowResults[row]} direction="row" />
    </div>
  );

  const renderColOperationsRow = (operationIndex: number) => (
    <div key={`col-ops-${operationIndex}`} className={styles.colOperationsRow}>
      <OperationDisplay
        operation={puzzle.colOperations[0][operationIndex]}
        direction="vertical"
      />
      <div className={styles.opSpacer} />
      <OperationDisplay
        operation={puzzle.colOperations[1][operationIndex]}
        direction="vertical"
      />
      <div className={styles.opSpacer} />
      <OperationDisplay
        operation={puzzle.colOperations[2][operationIndex]}
        direction="vertical"
      />
    </div>
  );

  return (
    <div className={styles.board}>
      <div className={styles.gridArea}>
        {/* Row 0 */}
        {renderRow(0)}

        {/* Column operations between row 0 and row 1 */}
        {renderColOperationsRow(0)}

        {/* Row 1 */}
        {renderRow(1)}

        {/* Column operations between row 1 and row 2 */}
        {renderColOperationsRow(1)}

        {/* Row 2 */}
        {renderRow(2)}
      </div>

      {/* Column results row */}
      <div className={styles.colResultsRow}>
        <ResultDisplay value={puzzle.colResults[0]} direction="column" />
        <div className={styles.resultSpacer} />
        <ResultDisplay value={puzzle.colResults[1]} direction="column" />
        <div className={styles.resultSpacer} />
        <ResultDisplay value={puzzle.colResults[2]} direction="column" />
      </div>
    </div>
  );
}

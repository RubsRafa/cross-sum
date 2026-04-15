export type Operation = "+" | "-" | "*" | "/";

export interface Puzzle {
  numbers: number[];
  rowOperations: [Operation, Operation][];
  colOperations: [Operation, Operation][];
  rowResults: number[];
  colResults: number[];
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function evaluateExpression(
  a: number,
  op1: Operation,
  b: number,
  op2: Operation,
  c: number,
): number {
  // Build expression respecting operator precedence
  const ops = [op1, op2];
  const nums = [a, b, c];

  // First pass: handle * and /
  const tempNums: number[] = [];
  const tempOps: Operation[] = [];

  let i = 0;
  while (i < nums.length) {
    if (i < ops.length && (ops[i] === "*" || ops[i] === "/")) {
      let current = nums[i];
      while (i < ops.length && (ops[i] === "*" || ops[i] === "/")) {
        if (ops[i] === "*") {
          current = current * nums[i + 1];
        } else {
          current = current / nums[i + 1];
        }
        i++;
      }
      tempNums.push(current);
    } else {
      tempNums.push(nums[i]);
      if (i < ops.length) {
        tempOps.push(ops[i]);
      }
      i++;
    }
  }

  // Second pass: handle + and -
  let result = tempNums[0];
  for (let j = 0; j < tempOps.length; j++) {
    if (tempOps[j] === "+") {
      result = result + tempNums[j + 1];
    } else if (tempOps[j] === "-") {
      result = result - tempNums[j + 1];
    }
  }

  return result;
}

function isValidDivision(
  a: number,
  op1: Operation,
  b: number,
  op2: Operation,
  c: number,
): boolean {
  // Check if divisions result in integers
  if (op1 === "/" && a % b !== 0) return false;
  if (op2 === "/") {
    if (op1 === "*" || op1 === "/") {
      // Need to check (a op1 b) / c
      const leftResult = op1 === "*" ? a * b : a / b;
      if (leftResult % c !== 0) return false;
    } else {
      // a + or - (b / c) - check b / c
      if (b % c !== 0) return false;
    }
  }

  return true;
}

function generateOperations(): [Operation, Operation] {
  const operations: Operation[] = ["+", "-", "*", "/"];
  return [
    operations[Math.floor(Math.random() * operations.length)],
    operations[Math.floor(Math.random() * operations.length)],
  ];
}

export function generatePuzzle(): Puzzle {
  let attempts = 0;
  const maxAttempts = 1000;

  while (attempts < maxAttempts) {
    attempts++;

    // Generate random permutation of 1-9
    const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    // Generate operations for rows and columns
    const rowOperations: [Operation, Operation][] = [
      generateOperations(),
      generateOperations(),
      generateOperations(),
    ];

    const colOperations: [Operation, Operation][] = [
      generateOperations(),
      generateOperations(),
      generateOperations(),
    ];

    // Check if all divisions are valid (result in integers)
    let valid = true;

    // Check rows
    for (let row = 0; row < 3; row++) {
      const a = numbers[row * 3];
      const b = numbers[row * 3 + 1];
      const c = numbers[row * 3 + 2];
      const [op1, op2] = rowOperations[row];

      if (!isValidDivision(a, op1, b, op2, c)) {
        valid = false;
        break;
      }
    }

    if (!valid) continue;

    // Check columns
    for (let col = 0; col < 3; col++) {
      const a = numbers[col];
      const b = numbers[col + 3];
      const c = numbers[col + 6];
      const [op1, op2] = colOperations[col];

      if (!isValidDivision(a, op1, b, op2, c)) {
        valid = false;
        break;
      }
    }

    if (!valid) continue;

    // Calculate results
    const rowResults: number[] = [];
    for (let row = 0; row < 3; row++) {
      const a = numbers[row * 3];
      const b = numbers[row * 3 + 1];
      const c = numbers[row * 3 + 2];
      const [op1, op2] = rowOperations[row];
      rowResults.push(evaluateExpression(a, op1, b, op2, c));
    }

    const colResults: number[] = [];
    for (let col = 0; col < 3; col++) {
      const a = numbers[col];
      const b = numbers[col + 3];
      const c = numbers[col + 6];
      const [op1, op2] = colOperations[col];
      colResults.push(evaluateExpression(a, op1, b, op2, c));
    }

    return {
      numbers,
      rowOperations,
      colOperations,
      rowResults,
      colResults,
    };
  }

  // Fallback puzzle if generation fails
  return {
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    rowOperations: [
      ["+", "+"],
      ["+", "+"],
      ["+", "+"],
    ],
    colOperations: [
      ["+", "+"],
      ["+", "+"],
      ["+", "+"],
    ],
    rowResults: [6, 15, 24],
    colResults: [12, 15, 18],
  };
}

export function checkSolution(
  userNumbers: (number | null)[],
  puzzle: Puzzle,
): boolean {
  // Check if all cells are filled
  if (userNumbers.some((n) => n === null)) return false;

  // Check if no duplicates
  const nums = userNumbers as number[];
  const uniqueNums = new Set(nums);
  if (uniqueNums.size !== 9) return false;

  // Check if all numbers are 1-9
  if (nums.some((n) => n < 1 || n > 9)) return false;

  // Check row results
  for (let row = 0; row < 3; row++) {
    const a = nums[row * 3];
    const b = nums[row * 3 + 1];
    const c = nums[row * 3 + 2];
    const [op1, op2] = puzzle.rowOperations[row];
    const result = evaluateExpression(a, op1, b, op2, c);
    if (result !== puzzle.rowResults[row]) return false;
  }

  // Check column results
  for (let col = 0; col < 3; col++) {
    const a = nums[col];
    const b = nums[col + 3];
    const c = nums[col + 6];
    const [op1, op2] = puzzle.colOperations[col];
    const result = evaluateExpression(a, op1, b, op2, c);
    if (result !== puzzle.colResults[col]) return false;
  }

  return true;
}

export function formatOperation(op: Operation): string {
  switch (op) {
    case "+":
      return "+";
    case "-":
      return "−";
    case "*":
      return "×";
    case "/":
      return "÷";
  }
}

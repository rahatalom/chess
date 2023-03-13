import { letters, nums } from "./constants";

export const getSquares = () => {
  let squares = [];

  for (let i = 0; i < letters.length; i++) {
    for (let j = 0; j < nums.length; j++) {
      squares.push(letters[i] + nums[j]);
    }
  }

  squares = squares.sort();

  return squares;
};

export const getRows = (squares: Array<string>) => {
  const rowObject: Record<string, Array<string>> = {};

  nums.forEach(
    (num) => (rowObject[num] = squares.filter((square) => +square[1] === num))
  );

  return Object.values(rowObject);
};

export const getInitialPosition = (rows: string[][]) => {
  const initialPositionObject: Record<string, string> = {};

  rows
    .join(",")
    .split(",")
    .forEach((square: string) => {
      const number = square[1];
      if (number === "7") {
        initialPositionObject[square] = "WPawn";
      }
      if (number === "2") {
        initialPositionObject[square] = "BPawn";
      }
      if (square === "A1" || square === "H1") {
        initialPositionObject[square] = "BRook";
      }
      if (square === "A8" || square === "H8") {
        initialPositionObject[square] = "WRook";
      }

      if (square === "B1" || square === "G1") {
        initialPositionObject[square] = "BKnight";
      }
      if (square === "B8" || square === "G8") {
        initialPositionObject[square] = "WKnight";
      }
      if (square === "C1" || square === "F1") {
        initialPositionObject[square] = "BBishop";
      }
      if (square === "C8" || square === "F8") {
        initialPositionObject[square] = "WBishop";
      }
      if (square === "D1") {
        initialPositionObject[square] = "BQueen";
      }
      if (square === "D8") {
        initialPositionObject[square] = "WQueen";
      }
      if (square === "E1") {
        initialPositionObject[square] = "BKing";
      }
      if (square === "E8") {
        initialPositionObject[square] = "WKing";
      }
    });

  return initialPositionObject;
};

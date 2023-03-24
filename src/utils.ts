import { letters, nums } from "./constants";
import { ChessPiece } from "./types";

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

  return Object.values(rowObject).reverse();
};

export const getInitialPosition = (rows: string[][]) => {
  const initialPositionObject: Record<string, ChessPiece> = {};

  rows
    .join(",")
    .split(",")
    .forEach((square: string) => {
      const number = square[1];
      if (number === "7") {
        initialPositionObject[square] = "BPawn";
      }
      if (number === "2") {
        initialPositionObject[square] = "WPawn";
      }
      if (square === "A1" || square === "H1") {
        initialPositionObject[square] = "WRook";
      }
      if (square === "A8" || square === "H8") {
        initialPositionObject[square] = "BRook";
      }

      if (square === "B1" || square === "G1") {
        initialPositionObject[square] = "WKnight";
      }
      if (square === "B8" || square === "G8") {
        initialPositionObject[square] = "BKnight";
      }
      if (square === "C1" || square === "F1") {
        initialPositionObject[square] = "WBishop";
      }
      if (square === "C8" || square === "F8") {
        initialPositionObject[square] = "BBishop";
      }
      if (square === "D1") {
        initialPositionObject[square] = "WQueen";
      }
      if (square === "D8") {
        initialPositionObject[square] = "BQueen";
      }
      if (square === "E1") {
        initialPositionObject[square] = "WKing";
      }
      if (square === "E8") {
        initialPositionObject[square] = "BKing";
      }
    });

  return initialPositionObject;
};

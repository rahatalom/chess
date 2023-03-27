import { letters } from "../constants";
import { ChessPieceType } from "../types";

export const getPossibleMoves = (
  positionObject: Record<string, ChessPieceType>,
  sourceId: string
) => {
  const movingPiece = positionObject[sourceId];
  let possibleMoves: string[] = [];
  const column = sourceId[0];
  const rank = +sourceId[1];

  if (movingPiece?.endsWith("Pawn")) {
    if (movingPiece.startsWith("W")) {
      possibleMoves.push(column + (rank + 1));
      if (rank === 2) {
        possibleMoves.push(column + (rank + 2));
      }
      possibleMoves = possibleMoves.filter((sqr) =>
        !positionObject[sqr]?.startsWith("B")
      );
      const index = letters.indexOf(column);
      const captureSquares = [
        letters[index + 1] + (rank + 1),
        letters[index - 1] + (rank + 1),
      ].filter((sqr) => sqr && positionObject[sqr]?.startsWith("B"));

      possibleMoves = [...possibleMoves, ...captureSquares];

      return possibleMoves;
    }
    if (movingPiece.startsWith("B")) {
      possibleMoves.push(column + (rank - 1));
      if (rank === 7) {
        possibleMoves.push(column + (rank - 2));
      }
      possibleMoves = possibleMoves.filter((sqr) =>
        !positionObject[sqr]?.startsWith("W")
      );

      const index = letters.indexOf(column);
      const captureSquares = [
        letters[index + 1] + (rank - 1),
        letters[index - 1] + (rank - 1),
      ].filter((sqr) => sqr && positionObject[sqr]?.startsWith("W"));

      possibleMoves = [...possibleMoves, ...captureSquares];

      return possibleMoves;
    }
  }
};

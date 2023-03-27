import { letters } from "../constants";
import { ChessPieceType } from "../types";

export const getPossibleMoves = (positionObject: Record<string,ChessPieceType>,sourceId: string) => {
    const movingPiece = positionObject[sourceId];
    if (movingPiece?.endsWith("Pawn")) {
      if (movingPiece.startsWith("W")) {
        const column = sourceId[0];
        const rank = +sourceId[1];
        let possibleMoves: string[] = [];
        possibleMoves.push(column + (rank + 1));
        if (rank === 2) {
          possibleMoves.push(column + (rank + 2));
        }
        const index = letters.indexOf(column);
        const captureSquares = [
          letters[index + 1] + (rank + 1),
          letters[index - 1] + (rank + 1),
        ].filter((sqr) => sqr && positionObject[sqr]?.startsWith("B"));

        possibleMoves = [...possibleMoves, ...captureSquares];

        return possibleMoves;
      }
      if (movingPiece.startsWith("B")) {
        const column = sourceId[0];
        const rank = +sourceId[1];
        let possibleMoves: string[] = [];
        possibleMoves.push(column + (rank - 1));
        if (rank === 7) {
          possibleMoves.push(column + (rank - 2));
        }
        const index = letters.indexOf(column);
        const captureSquares = [
          letters[index + 1] + (rank - 1),
          letters[index - 1] + (rank - 1),
        ].filter((sqr) => sqr && positionObject[sqr]?.startsWith("W"));

        possibleMoves = [...possibleMoves, ...captureSquares];

        return possibleMoves;
      }
    }
  }
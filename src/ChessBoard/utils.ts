import { compact } from "lodash";
import { letters } from "../constants";
import { ChessPieceType } from "../types";

export const getPossibleMoves = (
  positionObject: Record<string, ChessPieceType>,
  sourceId: string,
  moveList: string[],
  setEnPassantDestinationSquare: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
) => {
  const previousMoveArray = moveList[moveList?.length - 1]?.split("-");
  const movingPiece = positionObject[sourceId];
  if (!movingPiece) {
    return [];
  }

  // const color = movingPiece[0];
  let possibleMoves: string[] = [];
  const column = sourceId[0];
  const rank = +sourceId[1];

  if (movingPiece?.endsWith("Pawn")) {
    const index = letters.indexOf(column);
    const isEnPassantAvailable = previousMoveArray
      ? (positionObject[previousMoveArray[2]] === "WPawn" ||
          positionObject[previousMoveArray[2]] === "BPawn") &&
        (previousMoveArray[2] === letters[index + 1] + rank ||
          previousMoveArray[2] === letters[index - 1] + rank)
      : false;

    if (movingPiece.startsWith("W")) {
      possibleMoves.push(column + (rank + 1));
      if (rank === 2) {
        possibleMoves.push(column + (rank + 2));
      }
      possibleMoves = possibleMoves.filter(
        (sqr) => !positionObject[sqr]?.startsWith("B")
      );

      const captureSquares = [
        letters[index + 1] + (rank + 1),
        letters[index - 1] + (rank + 1),
      ].filter((sqr) => positionObject[sqr]);

      if (isEnPassantAvailable) {
        const enPassantCaptureSquare = previousMoveArray[2][0] + 6;
        setEnPassantDestinationSquare(enPassantCaptureSquare);
        captureSquares.push(enPassantCaptureSquare);
      }

      possibleMoves = compact([...possibleMoves, ...captureSquares]);

      return possibleMoves;
    }
    if (movingPiece.startsWith("B")) {
      possibleMoves.push(column + (rank - 1));
      if (rank === 7) {
        possibleMoves.push(column + (rank - 2));
      }
      possibleMoves = possibleMoves.filter(
        (sqr) => !positionObject[sqr]?.startsWith("W")
      );

      const index = letters.indexOf(column);

      const captureSquares = [
        letters[index + 1] + (rank - 1),
        letters[index - 1] + (rank - 1),
      ].filter((sqr) => positionObject[sqr]);

      if (isEnPassantAvailable) {
        const enPassantCaptureSquare = previousMoveArray[2][0] + 3;
        setEnPassantDestinationSquare(enPassantCaptureSquare);
        captureSquares.push(enPassantCaptureSquare);
      }

      possibleMoves = compact([...possibleMoves, ...captureSquares]);

      return possibleMoves;
    }
  }
  // if (movingPiece?.endsWith("Rook")) {
  //   let verticalRow = nums.map((num) => column + num);
  //   let horizontalRow = letters.map((letter) => letter + rank);

  //   const vObstaclePosition = verticalRow.findIndex(
  //     (sqr) =>
  //       positionObject[sqr]?.startsWith(color) &&
  //       positionObject[sqr] !== movingPiece
  //   );
  //   const hObstaclePosition = horizontalRow.findIndex(
  //     (sqr) =>
  //       positionObject[sqr]?.startsWith(color) &&
  //       positionObject[sqr] !== movingPiece
  //   );
  //   if (vObstaclePosition !== -1) {
  //     const v1 = verticalRow.slice(0, vObstaclePosition);
  //     const v2 = verticalRow.slice(vObstaclePosition + 1);
  //     verticalRow = v1.includes(sourceId) ? v1 : v2;
  //   }

  //   if (hObstaclePosition !== -1) {
  //     const h1 = horizontalRow.slice(0, hObstaclePosition);
  //     const h2 = horizontalRow.slice(hObstaclePosition + 1);
  //     horizontalRow = h1.includes(sourceId) ? h1 : h2;
  //   }

  //   possibleMoves = [...horizontalRow, ...verticalRow];

  //   return possibleMoves;
  // }
};

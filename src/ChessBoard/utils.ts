import { compact } from "lodash";
import { letters } from "../constants";
import { ChessPieceType } from "../types";
import { TurnType } from "./ChessBoard";

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

  let possibleMoves: string[] = [];
  const [column, rank] = [sourceId[0], +sourceId[1]];

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
        const enPassantDestinationSquare = previousMoveArray[2][0] + 6;
        setEnPassantDestinationSquare(enPassantDestinationSquare);
        captureSquares.push(enPassantDestinationSquare);
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
        const enPassantDestinationSquare = previousMoveArray[2][0] + 3;
        setEnPassantDestinationSquare(enPassantDestinationSquare);
        captureSquares.push(enPassantDestinationSquare);
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

const getValidCastlingSquares = (
  possibleCastlingSquares: string[],
  shortCastle: boolean,
  longCastle: boolean
) => {
  if (shortCastle && longCastle) {
    return possibleCastlingSquares;
  }
  if (shortCastle) {
    return [possibleCastlingSquares[1]];
  }
  if (longCastle) {
    return [possibleCastlingSquares[0]];
  } else {
    return [];
  }
};

export const getCastlingInfo = (
  turn: TurnType,
  positionObject: Record<string, ChessPieceType>
) => {
  const rank = turn === TurnType.White ? "1" : "8";
  const possibleCastlingSquares =
    turn === TurnType.White ? ["C1", "G1"] : ["C8", "G8"];

  const pieceRow = Object.values(
    Object.fromEntries(
      Object.entries(positionObject).filter((entry) => entry[0][1] === rank)
    )
  );

  const rookToCheck = turn === TurnType.White ? "WRook" : "BRook";
  const kingToCheck = turn === TurnType.White ? "WKing" : "BKing";

  const shortCastle =
    pieceRow[pieceRow.length - 2] === kingToCheck &&
    pieceRow[pieceRow.length - 1] === rookToCheck;
  const longCastle = pieceRow[0] === rookToCheck && pieceRow[1] === kingToCheck;

  const isCastlingAvailable = shortCastle || longCastle;

  const castleInfo = {
    isCastlingAvailable,
    castlingSquares: getValidCastlingSquares(
      possibleCastlingSquares,
      shortCastle,
      longCastle
    ),
  };

  return castleInfo;
};

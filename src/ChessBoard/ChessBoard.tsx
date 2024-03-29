import classNames from "classnames";
import React from "react";
import { BoardSideType } from "../Chess";
import { darkSquareColor, lightSquareColor } from "../constants";
import "./ChessBoard.css";
import { ChessPieceType } from "../types";
import { ChessPiece } from "./ChessPiece";
import { getInitialPosition } from "../utils";
import { isEqual } from "lodash";
import useSound from "use-sound";

import { getCastlingInfo, getPossibleMoves } from "./utils";
import move from "../Sounds/move.mp3";
import capture from "../Sounds/capture.mp3";

interface ChessBoardProps {
  rows: string[][];
  positionObject: Record<string, ChessPieceType>;
  setPositionObject: React.Dispatch<
    React.SetStateAction<Record<string, ChessPieceType>>
  >;
  positionObjectList: Record<string, ChessPieceType>[];
  setPositionObjectList: React.Dispatch<
    React.SetStateAction<Record<string, ChessPieceType>[]>
  >;
  boardSide: BoardSideType;
  moveList: string[];
  setMoveList: React.Dispatch<React.SetStateAction<string[]>>;
  soundList: string[];
  setSoundList: React.Dispatch<React.SetStateAction<string[]>>;
}

export enum TurnType {
  Black = "B",
  White = "W",
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  rows,
  positionObject,
  setPositionObject,
  positionObjectList,
  setPositionObjectList,
  boardSide,
  moveList,
  setMoveList,
  soundList,
  setSoundList,
}) => {
  const [sourceId, setSourceId] = React.useState("");
  const [destinationId, setDestinationId] = React.useState("");
  const [isPieceCaptureInvalid, setIsPieceCaptureInvalid] =
    React.useState(false);
  const [turn, setTurn] = React.useState<TurnType>(TurnType.White);

  const [selectedPromotionPiece, setSelectedPromotionPiece] = React.useState<
    ChessPieceType | undefined
  >(undefined);
  const [enPassantDestinationSquare, setEnPassantDestinationSquare] =
    React.useState<string | undefined>(undefined);

  const [conventionalCaptureWasMade, setConventionalCaptureWasMade] =
    React.useState<boolean>(false);

  const [moveSound] = useSound(move);
  const [captureSound] = useSound(capture);

  const castleInfo = React.useMemo(
    () => getCastlingInfo(turn, positionObject),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [turn]
  );

  const getIsPieceCaptureInvalid = React.useCallback(
    (destination: string) => {
      if (!positionObject[destination]) {
        return false;
      }
      return (
        (positionObject[sourceId][0] === "W" &&
          positionObject[destination][0] === "W") ||
        (positionObject[sourceId][0] === "B" &&
          positionObject[destination][0] === "B") ||
        positionObject[destination].endsWith("King")
      );
    },
    [positionObject, sourceId]
  );

  const possibleMoves = React.useMemo(
    () =>
      getPossibleMoves(
        positionObject,
        sourceId,
        moveList,
        setEnPassantDestinationSquare
      ),
    [moveList, positionObject, sourceId]
  );

  const onDragEnd = () => {
    if (isPieceCaptureInvalid || !destinationId || sourceId === "") {
      return;
    }

    if (!possibleMoves?.includes(destinationId) && possibleMoves) {
      return;
    }

    if (destinationId.length) {
      let filteredObj = Object.fromEntries(
        Object.entries(positionObject).filter((entry) => entry[0] !== sourceId)
      );

      const captureWasMade =
        conventionalCaptureWasMade ||
        destinationId === enPassantDestinationSquare;

      if (destinationId === enPassantDestinationSquare) {
        const [enPassantColumn, enPassantRank] = [
          enPassantDestinationSquare[0],
          +enPassantDestinationSquare[1],
        ];
        const enPassantCaptureSquare =
          positionObject[sourceId] === "WPawn"
            ? enPassantColumn + (enPassantRank - 1)
            : enPassantColumn + (enPassantRank + 1);

        filteredObj = Object.fromEntries(
          Object.entries(filteredObj).filter(
            (entry) => entry[0] !== enPassantCaptureSquare
          )
        );
      }

      if (positionObject[sourceId].endsWith("King")) {
        if (
          castleInfo.isCastlingAvailable &&
          castleInfo.castlingSquares.includes(destinationId)
        ) {
          const color = positionObject[sourceId][0];
          const isShortCastle = destinationId.startsWith("G");
          const rookDestinationToFilter = isShortCastle
            ? "H" + destinationId[1]
            : "A" + destinationId[1];
          filteredObj = Object.fromEntries(
            Object.entries(filteredObj).filter(
              (entry) => entry[0] !== rookDestinationToFilter
            )
          );
          const rookDestinationAfterCastling = isShortCastle
            ? "F" + destinationId[1]
            : "D" + destinationId[1];
          filteredObj = {
            ...filteredObj,
            [rookDestinationAfterCastling]: (color + "Rook") as ChessPieceType,
          };
        }
      }

      if (captureWasMade) {
        captureSound();
        setSoundList([...soundList, "capture"]);
      } else {
        moveSound();
        setSoundList([...soundList, "move"]);
      }

      setPositionObject(filteredObj);
      setPositionObjectList([...positionObjectList, filteredObj]);
      setMoveList([
        ...moveList,
        sourceId + "-" + positionObject[sourceId] + "-" + destinationId,
      ]);
      setTurn((value) => {
        if (value === TurnType.White) {
          return TurnType.Black;
        } else {
          return TurnType.White;
        }
      });
      setEnPassantDestinationSquare(undefined);
      setConventionalCaptureWasMade(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const destination = Object.values(e.target)[1].id;
    setDestinationId(destination);
    const isCaptureInvalid = getIsPieceCaptureInvalid(destination);
    setIsPieceCaptureInvalid(isCaptureInvalid);
    if (getIsPieceCaptureInvalid(destination)) {
      return;
    }

    if (!possibleMoves?.includes(destination) && possibleMoves) {
      return;
    }

    if (!isCaptureInvalid && positionObject[destination]) {
      setConventionalCaptureWasMade(true);
    }

    setPositionObject({
      ...positionObject,
      [destination]: positionObject[sourceId],
    });
  };

  React.useEffect(() => {
    if (selectedPromotionPiece) {
      setPositionObject({
        ...positionObject,
        [destinationId]: selectedPromotionPiece as ChessPieceType,
      });

      setSelectedPromotionPiece(undefined);
    }
  }, [
    destinationId,
    positionObject,
    selectedPromotionPiece,
    setPositionObject,
  ]);

  React.useEffect(() => {
    if (isEqual(positionObject, getInitialPosition(rows))) {
      setSourceId("");
      setDestinationId("");
      setTurn(TurnType.White);
    }
  }, [positionObject, rows]);

  return (
    <div
      className={classNames("chess-board", {
        "chess-board-rotated": boardSide === BoardSideType.Black,
      })}
    >
      {rows.map((row, index) => {
        const isEven = index % 2 === 0;
        const colorArray = isEven
          ? [lightSquareColor, darkSquareColor]
          : [darkSquareColor, lightSquareColor];

        return (
          <div className="chess-board-row">
            {row.map((square: string, index) => {
              const colorIndex = index % 2 === 0 ? 0 : 1;
              const squareColor = colorArray[colorIndex];
              const piece: ChessPieceType = positionObject[square];

              return (
                <div
                  className="chess-board-piece-container"
                  onDragStart={(e) => {
                    const source = Object.values(e.target)[1].id;
                    if (positionObject[source][0] !== turn) {
                      setSourceId("");
                      setDestinationId("");
                      return;
                    }
                    setSourceId(source);
                  }}
                  onDragEnd={onDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  style={{
                    backgroundColor: squareColor,
                    color: !piece ? squareColor : undefined,
                    border: `${squareColor} 10px solid`,
                  }}
                >
                  {positionObject[square] ? (
                    <ChessPiece
                      piece={piece}
                      square={square}
                      boardSide={boardSide}
                      selectedPromotionPiece={selectedPromotionPiece}
                      setSelectedPromotionPiece={setSelectedPromotionPiece}
                    />
                  ) : (
                    <div className="chess-board-empty-square" id={square} />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

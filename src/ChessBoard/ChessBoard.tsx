import classNames from "classnames";
import React from "react";
import { BoardSideType } from "../Chess";
import { darkSquareColor, lightSquareColor } from "../constants";
import "./ChessBoard.css";
import { ChessPieceType } from "../types";
import { ChessPiece } from "./ChessPiece";
import { getInitialPosition } from "../utils";
import { isEqual } from "lodash";

interface ChessBoardProps {
  rows: string[][];
  positionObject: Record<string, ChessPieceType>;
  setPositionObject: React.Dispatch<
    React.SetStateAction<Record<string, ChessPieceType>>
  >;
  list: Record<string, ChessPieceType>[];
  setList: React.Dispatch<
    React.SetStateAction<Record<string, ChessPieceType>[]>
  >;
  boardSide: BoardSideType;
}

enum TurnType {
  Black = "B",
  White = "W",
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  rows,
  positionObject,
  setPositionObject,
  list,
  setList,
  boardSide,
}) => {
  const [sourceId, setSourceId] = React.useState("");
  const [destinationId, setDestinationId] = React.useState("");
  const [isPieceCaptureInvalid, setIsPieceCaptureInvalid] = React.useState(false);
  const [turn, setTurn] = React.useState<TurnType>(TurnType.White);

  const [selectedPromotionPiece, setSelectedPromotionPiece] =
    React.useState<ChessPieceType>("BKnight");
  const [pieceSelected, setPieceSelected] = React.useState<boolean>(false);

  const getIsPieceCaptureInvalid = React.useCallback(
    (id: string) => {
      if (!positionObject[id]) {
        return false;
      }
      return (
        (positionObject[sourceId][0] === "W" &&
          positionObject[id][0] === "W") ||
        (positionObject[sourceId][0] === "B" &&
          positionObject[id][0] === "B") ||
        positionObject[id].endsWith("King")
      );
    },
    [positionObject, sourceId]
  );

  // const possibleMoves = React.useMemo(
  //   () => getPossibleMoves(positionObject, sourceId),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [sourceId]
  // );

  const onDragEnd = React.useCallback(() => {
    if (isPieceCaptureInvalid || !destinationId || sourceId === "") {
      return;
    }

    // if (!possibleMoves?.includes(destinationId) && possibleMoves) {
    //   return;
    // }

    if (destinationId.length) {
      const filteredObj = Object.fromEntries(
        Object.entries(positionObject).filter((entry) => entry[0] !== sourceId)
      );
      setPositionObject(filteredObj);
      setList([...list, filteredObj]);
      setTurn((value) => {
        if (value === TurnType.White) {
          return TurnType.Black;
        } else {
          return TurnType.White;
        }
      });
    }
  }, [
    isPieceCaptureInvalid,
    destinationId,
    list,
    positionObject,
    setList,
    setPositionObject,
    sourceId,
  ]);

  const onDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const id = Object.values(e.target)[1].id;
      setDestinationId(id);
      setIsPieceCaptureInvalid(getIsPieceCaptureInvalid(id));
      if (getIsPieceCaptureInvalid(id)) {
        return;
      }

      // if (!possibleMoves?.includes(id) && possibleMoves) {
      //   return;
      // }

      setPositionObject({
        ...positionObject,
        [id]: positionObject[sourceId],
      });
    },
    [getIsPieceCaptureInvalid, positionObject, setPositionObject, sourceId]
  );

  React.useEffect(() => {
    if (pieceSelected) {
      setPositionObject({
        ...positionObject,
        [destinationId]: selectedPromotionPiece,
      });

      setPieceSelected(false);
      setSelectedPromotionPiece("BKnight");
    }
  }, [
    destinationId,
    pieceSelected,
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
                    const id = Object.values(e.target)[1].id;
                    if (positionObject[id][0] !== turn) {
                      setSourceId("");
                      setDestinationId("");
                      return;
                    }
                    setSourceId(id);
                  }}
                  onDragEnd={() => {
                    onDragEnd();
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDrop(e)}
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
                      pieceSelected={pieceSelected}
                      setPieceSelected={setPieceSelected}
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

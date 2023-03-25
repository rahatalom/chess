import classNames from "classnames";
import React from "react";
import { BoardSideType } from "../Chess";
import { darkSquareColor, imageObj, lightSquareColor } from "../constants";
import "./ChessBoard.css";
import { ChessPiece } from "../types";
import { Popover } from "antd";
import { getPopoverContent } from "./getPopoverContent";

interface ChessBoardProps {
  rows: string[][];
  positionObject: Record<string, ChessPiece>;
  setPositionObject: React.Dispatch<
    React.SetStateAction<Record<string, ChessPiece>>
  >;
  list: Record<string, ChessPiece>[];
  setList: React.Dispatch<React.SetStateAction<Record<string, ChessPiece>[]>>;
  boardSide: BoardSideType;
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
  const [IsSameColor, setIsSameColor] = React.useState(false);

  const getIsSameColor = React.useCallback(
    (id: string) => {
      if (!positionObject[id]) {
        return false;
      }
      return (
        (positionObject[sourceId][0] === "W" &&
          positionObject[id][0] === "W") ||
        (positionObject[sourceId][0] === "B" && positionObject[id][0] === "B")
      );
    },
    [positionObject, sourceId]
  );

  const onDragEnd = React.useCallback(() => {
    if (IsSameColor) {
      return;
    }
    if (destinationId.length) {
      const filteredObj = Object.fromEntries(
        Object.entries(positionObject).filter((entry) => entry[0] !== sourceId)
      );
      setPositionObject(filteredObj);
      setList([...list, filteredObj]);
    }
  }, [
    IsSameColor,
    destinationId.length,
    list,
    positionObject,
    setList,
    setPositionObject,
    sourceId,
  ]);

  const [selectedPromotionPiece, setSelectedPromotionPiece] =
    React.useState<ChessPiece>("BKnight");
  const [pieceSelected, setPieceSelected] = React.useState<boolean>(false);

  const onDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const id = Object.values(e.target)[1].id;
      setDestinationId(id);
      setIsSameColor(getIsSameColor(id));
      if (getIsSameColor(id)) {
        return;
      }

      setPositionObject({
        ...positionObject,
        [id]: positionObject[sourceId],
      });
    },
    [getIsSameColor, positionObject, setPositionObject, sourceId]
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
              const piece: ChessPiece = positionObject[square];

              return (
                <div
                  className="chess-board-piece-container"
                  onDragStart={(e) => {
                    const id = Object.values(e.target)[1].id;
                    setSourceId(id);
                  }}
                  onDragEnd={() => {
                    onDragEnd();
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDrop(e)}
                  style={{
                    backgroundColor: squareColor,
                    color: !positionObject[square] ? squareColor : undefined,
                    border: `${squareColor} 10px solid`,
                  }}
                >
                  {positionObject[square] ? (
                    <Popover
                      color={lightSquareColor}
                      open={
                        (square[1] === "1" || square[1] === "8") &&
                        (piece === "WPawn" || piece === "BPawn") &&
                        !pieceSelected
                      }
                      content={getPopoverContent(
                        piece,
                        setSelectedPromotionPiece,
                        setPieceSelected
                      )}
                    >
                      <img
                        className={classNames("chess-board-piece", {
                          "chess-board-piece-rotated":
                            boardSide === BoardSideType.Black,
                        })}
                        src={imageObj[piece]}
                        id={square}
                        alt={imageObj.BKnight}
                      />
                    </Popover>
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

import classNames from "classnames";
import React from "react";
import { BoardSideType } from "./Chess";
import { ImageObj } from "./constants";

interface ChessBoardProps {
  rows: string[][];
  positionObject: Record<string, string>;
  setPositionObject: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  list: Record<string, string>[];
  setList: React.Dispatch<React.SetStateAction<Record<string, string>[]>>;
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

  return (
    <div
      className={classNames("chess-board", {
        "chess-board-rotated": boardSide === BoardSideType.Black,
      })}
    >
      {rows.map((row, index) => {
        const isEven = index % 2 === 0;
        const colorArray = isEven ? ["#99a", "#445"] : ["#445", "#99a"];

        return (
          <div style={{ display: "flex", flexDirection: "row" }}>
            {row.map((square: string, index) => {
              const colorIndex = index % 2 === 0 ? 0 : 1;
              return (
                <div
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
                    height: "60px",
                    width: "60px",
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colorArray[colorIndex],
                    color: !positionObject[square]
                      ? colorArray[colorIndex]
                      : undefined,
                    border: `${colorArray[colorIndex]} 10px solid`,
                  }}
                >
                  {positionObject[square] ? (
                    <img
                      src={ImageObj[positionObject[square]]}
                      id={square}
                      style={{
                        height: "70px",
                        width: "70px",
                        cursor: "grab",

                        rotate:
                          boardSide === BoardSideType.Black
                            ? "180deg"
                            : undefined,
                      }}
                      alt={ImageObj.BKnight}
                    />
                  ) : (
                    <div
                      style={{
                        height: "70px",
                        width: "70px",
                      }}
                      id={square}
                    >
                      {square}
                    </div>
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

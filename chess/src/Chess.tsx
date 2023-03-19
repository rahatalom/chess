import React from "react";
import "./Chess.css";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { isEmpty } from "lodash";
import { ImageObj } from "./constants";
import classNames from "classnames";

import { getInitialPosition, getRows, getSquares } from "./utils";

enum BoardSideType {
  Black = "black",
  White = "white",
}

export const Chess = () => {
  const squares = getSquares();

  const rows = getRows(squares);

  const [positionObject, setPositionObject] = React.useState(
    getInitialPosition(rows)
  );
  const [sourceId, setSourceId] = React.useState("");
  const [destinationId, setDestinationId] = React.useState("");

  const [list, setList] = React.useState<Record<string, string>[]>([]);

  const [boardSide, setBoardSide] = React.useState<BoardSideType>(
    BoardSideType.White
  );

  document.onkeydown = function (e) {
    var keyCode = e.keyCode;
    if (keyCode === 37) {
      prev();
    }
    if (keyCode === 39) {
      next();
    }
  };

  const prev = React.useCallback(() => {
    const index = list.indexOf(positionObject);
    setPositionObject(list[index - 1] ?? getInitialPosition(rows));
  }, [list, positionObject, rows]);

  const next = React.useCallback(() => {
    const index = list.indexOf(positionObject);
    setPositionObject(
      list[index + 1] ?? list[index] ?? getInitialPosition(rows)
    );
  }, [list, positionObject, rows]);

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

  const [IsSameColor, setIsSameColor] = React.useState(false);

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
  }, [IsSameColor, destinationId, list, positionObject, sourceId]);

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
    [getIsSameColor, positionObject, sourceId]
  );

  return (
    <div className="chess">
      <div className="chess-header">
        <h1 className="chess-header-text">Chess</h1>
        <div className="chess-button-container">
          <Tooltip title="Restart">
            <button
              className="chess-button"
              onClick={() => {
                setPositionObject(getInitialPosition(rows));
                setList([]);
              }}
            >
              ↺
            </button>
          </Tooltip>
          <button
            className="chess-button"
            disabled={isEmpty(list)}
            onClick={() => prev()}
          >
            <Tooltip title="Previous move">
              <CaretLeftOutlined />
            </Tooltip>
          </button>

          <button
            className="chess-button"
            disabled={isEmpty(list)}
            onClick={() => next()}
          >
            <Tooltip title="Next move">
              <CaretRightOutlined />
            </Tooltip>
          </button>

          <Tooltip title="Flip board">
            <button
              onClick={() =>
                setBoardSide((state) => {
                  if (state === BoardSideType.White) {
                    return BoardSideType.Black;
                  } else {
                    return BoardSideType.White;
                  }
                })
              }
              className="chess-button"
            >
              <RetweetOutlined />
            </button>
          </Tooltip>
        </div>
      </div>

      <div
        className={classNames("chess-board", {
          "chess-board-rotated": boardSide === BoardSideType.Black,
        })}
      >
        {rows.map((row, index) => {
          const isEven = index % 2 === 0;
          const colorArray = isEven ? ["#613", "#8a3"] : ["#8a3", "#613"];

          return (
            <div style={{ display: "flex", flexDirection:"row" }}>
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
                          gap:"0",

                          rotate:
                            boardSide === BoardSideType.Black
                              ? "180deg"
                              : undefined,
                        }}
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
    </div>
  );
};

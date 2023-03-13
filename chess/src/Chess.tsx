import React from "react";
import "./Chess.css";
import { ImageObj } from "./constants";
import { getInitialPosition, getRows, getSquares } from "./utils";

export const Chess = () => {
  const squares = getSquares();

  const rows = getRows(squares);

  const [positionObject, setPositionObject] = React.useState(
    getInitialPosition(rows)
  );
  const [sourceId, setSourceId] = React.useState("");

  return (
    <div className="chess">
      <div className="chess-header">
        <h1 className="chess-header-text">Chess</h1>

        <button
          className="reset-button"
          onClick={() => setPositionObject(getInitialPosition(rows))}
        >
          🔄
        </button>
      </div>

      <div className="chess-board">
        {rows.map((row, index) => {
          const isEven = index % 2 === 0;
          const colorArray = isEven
            ? ["#F1DBBF", "#C27664"]
            : ["#C27664", "#F1DBBF"];

          return (
            <div style={{ display: "block", width: "fit-content" }}>
              {row.map((square: string, index) => {
                const colorIndex = index % 2 === 0 ? 0 : 1;
                return (
                  <div
                    onDragStart={(e) => {
                      const id = Object.values(e.target)[1].id;

                      setSourceId(id);
                    }}
                    onDragEnd={() => {
                      const filteredObj = Object.fromEntries(
                        Object.entries(positionObject).filter(
                          (entry) => entry[0] !== sourceId
                        )
                      );
                      setPositionObject(filteredObj);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const id = Object.values(e.target)[1].id;

                      setPositionObject({
                        ...positionObject,
                        [id]: positionObject[sourceId],
                      });
                    }}
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
                    <img
                      id={square}
                      style={{
                        height: "55px",
                        width: "55px",
                      }}
                      src={ImageObj[positionObject[square]]}
                      draggable={true}
                    />
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

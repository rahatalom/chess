import React from "react";
import "./Chess.less";
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
    <>
      <h1 style={{ color: "gray", paddingTop: "20px", fontSize: "40px" }}>
        Chess
      </h1>
      <div className="chess">
        <div className="chess-board">
          {rows.map((row, index) => {
            const isEven = index % 2 === 0;
            const colorArray = isEven
              ? ["whitesmoke", "#609EA2"]
              : ["#609EA2", "whitesmoke"];

            return (
              <div style={{ display: "block" }}>
                {row.map((square: string, index) => {
                  const colorIndex = index % 2 === 0 ? 0 : 1;
                  return (
                    <div
                      draggable={true}
                      onDragStart={(e) => {
                        const id = Object.values(e.target)[1].id;

                        setSourceId(id);
                      }}
                      onDragEnd={(e) => {
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

                        setPositionObject({ ...positionObject, [id]: positionObject[sourceId] });
                      }}
                      style={{
                        height: "60px",
                        width: "60px",
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colorArray[colorIndex],
                        color: !positionObject[square] ? colorArray[colorIndex] : undefined,
                        border: `${colorArray[colorIndex]} 0.5px solid`,
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
        <button onClick={() => setPositionObject(getInitialPosition(rows))} style={{marginTop: "30px"}}>Reset</button>
      </div>
    </>
  );
};

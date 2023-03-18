import React from "react";
import "./Chess.css";
import {
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { isEmpty } from "lodash";
import { ImageObj } from "./constants";
import { getInitialPosition, getRows, getSquares } from "./utils";

export const Chess = () => {
  const squares = getSquares();

  const rows = getRows(squares);

  const [positionObject, setPositionObject] = React.useState(
    getInitialPosition(rows)
  );
  const [sourceId, setSourceId] = React.useState("");
  const [destinationId, setDestinationId] = React.useState("");

  const [list, setList] = React.useState<Record<string, string>[]>([]);

  document.onkeydown = function (e) {
    var keyCode = e.keyCode;
    if(keyCode === 37) {
        prev();
    }
    if(keyCode === 39){
      next()
    }
};

const prev = React.useCallback(() =>{
  const index = list.indexOf(positionObject);
  setPositionObject(list[index - 1] ?? getInitialPosition(rows));
},[list, positionObject, rows])

const next = React.useCallback(() =>{
  const index = list.indexOf(positionObject);
  setPositionObject(list[index + 1] ?? list[index] ?? getInitialPosition(rows))
},[list, positionObject, rows])

  return (
    <div className="chess">
      <div className="chess-header">
        <h1 className="chess-header-text">Chess</h1>
        <div className="chess-button-container">
          <button
            className="chess-button"
            onClick={() => {
              setPositionObject(getInitialPosition(rows));
              setList([]);
            }}
          >
            ↺
          </button>
          <button
            className="chess-button"
            disabled={isEmpty(list)}
            onClick={() => prev()}
          >
            <LeftOutlined/>
          </button>
          <button
            className="chess-button"
            disabled={isEmpty(list)}
            onClick={() => next()}
          >
            <RightOutlined/>
          </button>
        </div>
      </div>

      <div className="chess-board">
        {rows.map((row, index) => {
          const isEven = index % 2 === 0;
          const colorArray = isEven ? ["#99a", "#445"] : ["#445", "#99a"];

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
                      if (sourceId !== destinationId && destinationId.length) {
                        const filteredObj = Object.fromEntries(
                          Object.entries(positionObject).filter(
                            (entry) => entry[0] !== sourceId
                          )
                        );
                        setPositionObject(filteredObj);
                        setList([...list, filteredObj]);
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const id = Object.values(e.target)[1].id;
                      setDestinationId(id);

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
                    <object
                      data={ImageObj[positionObject[square]]}
                      type="image/jpeg"
                      id={square}
                      style={{
                        height: "70px",
                        width: "70px",
                        cursor: "grab",
                      }}
                    >
                      <img alt="" src={undefined} />
                    </object>
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

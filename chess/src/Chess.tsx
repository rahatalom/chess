import React from "react";
import "./Chess.less";

const nums = [1, 2, 3, 4, 5, 6, 7, 8];
const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

const obj: any = {
  WPawn:
    "https://cdn3.iconfinder.com/data/icons/font-awesome-regular-1/512/chess-pawn-128.png",
  WKnight:
    "https://cdn3.iconfinder.com/data/icons/font-awesome-regular-1/512/chess-knight-128.png",
  WBishop:
    "https://cdn3.iconfinder.com/data/icons/font-awesome-regular-1/512/chess-bishop-128.png",
  WRook:
    "https://cdn3.iconfinder.com/data/icons/font-awesome-regular-1/512/chess-rook-512.png",
  WQueen:
    "https://cdn3.iconfinder.com/data/icons/font-awesome-regular-1/512/chess-queen-128.png",
  WKing:
    "https://cdn3.iconfinder.com/data/icons/font-awesome-regular-1/512/chess-king-128.png",
  BPawn:
    "https://cdn3.iconfinder.com/data/icons/font-awesome-solid/512/chess-pawn-128.png",
  BKnight:
    "https://cdn0.iconfinder.com/data/icons/font-awesome-solid-vol-1/512/chess-knight-128.png",
  BBishop:
    "https://cdn3.iconfinder.com/data/icons/font-awesome-solid/512/chess-bishop-128.png",
  BRook:
    "https://cdn0.iconfinder.com/data/icons/font-awesome-solid-vol-1/512/chess-rook-128.png",
  BQueen:
    "https://cdn3.iconfinder.com/data/icons/font-awesome-solid/512/chess-queen-128.png",
  BKing:
    "https://cdn0.iconfinder.com/data/icons/font-awesome-solid-vol-1/512/chess-king-128.png",
};

const getSquareNumber = (square: string) => {
  const num = +square[1];
  const letter = square[0];
  return nums.indexOf(num) * 8 + letters.indexOf(letter);
};

const getRows = (squares: Array<string>) => {
  const x: Record<string, Array<string>> = {};

  nums.forEach(
    (num) => (x[num] = squares.filter((square) => +square[1] === num))
  );

  return x;
};

export const Chess = () => {
  let squares = [];

  for (let i = 0; i < letters.length; i++) {
    for (let j = 0; j < nums.length; j++) {
      squares.push(letters[i] + nums[j]);
    }
  }

  squares = squares.sort();

  const rows = Object.values(getRows(squares));

  const x: Record<string, string> = {};

  rows
    .join(",")
    .split(",")
    .forEach((square: string) => {
      const number = square[1];
      if (number === "7") {
        x[square] = "WPawn";
      }
      if (number === "2") {
        x[square] = "BPawn";
      }
      if (square === "A1" || square === "H1") {
        x[square] = "BRook";
      }
      if (square === "A8" || square === "H8") {
        x[square] = "WRook";
      }

      if (square === "B1" || square === "G1") {
        x[square] = "BKnight";
      }
      if (square === "B8" || square === "G8") {
        x[square] = "WKnight";
      }
      if (square === "C1" || square === "F1") {
        x[square] = "BBishop";
      }
      if (square === "C8" || square === "F8") {
        x[square] = "WBishop";
      }
      if (square === "D1") {
        x[square] = "BQueen";
      }
      if (square === "D8") {
        x[square] = "WQueen";
      }
      if (square === "E1") {
        x[square] = "BKing";
      }
      if (square === "E8") {
        x[square] = "WKing";
      }
    });

  const [obj2, setObj2] = React.useState(x);
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
            const y = isEven
              ? ["whitesmoke", "#609EA2"]
              : ["#609EA2", "whitesmoke"];

            return (
              <div style={{ display: "block" }}>
                {row.map((square: string, index) => {
                  const indexz = index % 2 === 0 ? 0 : 1;
                  return (
                    <div
                      draggable={true}
                      onDragStart={(e) => {
                        const id = Object.values(e.target)[1].id;

                        setSourceId(id);

                        console.log(x[id]);
                      }}
                      onDragEnd={(e) => {
                        const filteredObj = Object.fromEntries(
                          Object.entries(obj2).filter(
                            (entry) => entry[0] !== sourceId
                          )
                        );
                        setObj2(filteredObj);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        const id = Object.values(e.target)[1].id;

                        setObj2({ ...obj2, [id]: obj2[sourceId] });

                        console.log(x[id]);
                      }}
                      style={{
                        height: "60px",
                        width: "60px",
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: y[indexz],
                        color: !obj2[square] ? y[indexz] : undefined,
                        border: `${y[indexz]} 0.5px solid`,
                      }}
                    >
                      <img
                        id={square}
                        style={{ height: "55px", width: "55px" }}
                        src={obj[obj2[square]]}
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
    </>
  );
};

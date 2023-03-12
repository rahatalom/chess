import React from "react";
import "./Chess.less";

const nums = [1, 2, 3, 4, 5, 6, 7, 8];
const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

const obj: any = {
  Pawn: "https://cdn3.iconfinder.com/data/icons/font-awesome-regular-1/512/chess-pawn-128.png",
  Knight:
    "https://cdn3.iconfinder.com/data/icons/font-awesome-regular-1/512/chess-knight-128.png",
  Bishop:
    "https://cdn3.iconfinder.com/data/icons/font-awesome-regular-1/512/chess-bishop-128.png",
  Rook: "https://cdn3.iconfinder.com/data/icons/font-awesome-regular-1/512/chess-rook-512.png",
  Queen:
    "https://cdn3.iconfinder.com/data/icons/font-awesome-regular-1/512/chess-queen-128.png",
  King: "https://cdn3.iconfinder.com/data/icons/font-awesome-regular-1/512/chess-king-128.png",
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
      if (number === "2" || number === "7") {
        x[square] = "Pawn";
      }
      if (
        square === "A1" ||
        square === "H1" ||
        square === "A8" ||
        square === "H8"
      ) {
        x[square] = "Rook";
      }
      if (
        square === "B1" ||
        square === "G1" ||
        square === "B8" ||
        square === "G8"
      ) {
        x[square] = "Knight";
      }
      if (
        square === "C1" ||
        square === "F1" ||
        square === "C8" ||
        square === "F8"
      ) {
        x[square] = "Bishop";
      }
      if (square === "D1" || square === "D8") {
        x[square] = "Queen";
      }
      if (square === "E1" || square === "E8") {
        x[square] = "King";
      }
    });

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
                      onDragStart={(e) => console.log(e.target)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => console.log(e.target)}
                      style={{
                        height: "60px",
                        width: "60px",
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: y[indexz],
                        color: !x[square] ? y[indexz] : undefined,
                        border: `${y[indexz]} 0.5px solid`,
                      }}
                    >
                      <img
                        id={square}
                        style={{ height: "55px", width: "55px" }}
                        src={obj[x[square]]}
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

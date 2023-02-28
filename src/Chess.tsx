import React from "react";
import "./Chess.less";

const nums = [1, 2, 3, 4, 5, 6, 7, 8];
const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

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

  const x = {};

  rows
    .join(",")
    .split(",")
    .forEach((square) => {
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
        x[square] = "Bishop";
      }
      if (
        square === "C1" ||
        square === "F1" ||
        square === "C8" ||
        square === "F8"
      ) {
        x[square] = "Knight";
      }
      if (square === "D1" || square === "D8") {
        x[square] = "Queen";
      }
      if (square === "E1" || square === "E8") {
        x[square] = "King";
      }
    });

  console.log(x);

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
                {row.map((square, index) => {
                  const indexz = index % 2 === 0 ? 0 : 1;
                  return (
                    <div
                      style={{
                        height: "60px",
                        width: "60px",
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: y[indexz],
                        color: !x[square] ? y[indexz] : null,
                        border: `${y[indexz]} 0.5px solid`
                      }}
                    >
                      {x[square] ?? square}
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

import React from "react";
import "./Chess.css";

import { Typography } from "antd";

import { getInitialPosition, getRows, getSquares } from "./utils";
import { ActionButtons } from "./ActionButtons";
import { ChessBoard } from "./ChessBoard";
import { ChessPiece } from "./types";

export enum BoardSideType {
  Black = "black",
  White = "white",
}

export const Chess = () => {
  const squares = getSquares();

  const rows = getRows(squares);

  const [positionObject, setPositionObject] = React.useState<Record<string, ChessPiece>>(
    getInitialPosition(rows)
  );

  const [list, setList] = React.useState<Record<string, ChessPiece>[]>([]);

  const [boardSide, setBoardSide] = React.useState<BoardSideType>(
    BoardSideType.White
  );

  return (
    <div className="chess">
      <div className="chess-header">
        <Typography.Title className="chess-header-text">Chess</Typography.Title>
        <ActionButtons
          rows={rows}
          positionObject={positionObject}
          setPositionObject={setPositionObject}
          list={list}
          setList={setList}
          setBoardSide={setBoardSide}
        />
      </div>

      <ChessBoard
        rows={rows}
        positionObject={positionObject}
        setPositionObject={setPositionObject}
        list={list}
        setList={setList}
        boardSide={boardSide}
      />
    </div>
  );
};

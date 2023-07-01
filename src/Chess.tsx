import React from "react";
import "./Chess.css";

import { Typography } from "antd";

import { getInitialPosition, getRows, getSquares } from "./utils";
import { ActionButtons } from "./ActionButtons";
import { ChessPieceType } from "./types";
import { ChessBoard } from "./ChessBoard";

export enum BoardSideType {
  Black = "black",
  White = "white",
}

export const Chess = () => {
  const squares = getSquares();

  const rows = getRows(squares);

  const [positionObject, setPositionObject] = React.useState<
    Record<string, ChessPieceType>
  >(getInitialPosition(rows));

  const [positionObjectList, setPositionObjectList] = React.useState<
    Record<string, ChessPieceType>[]
  >([]);
  const [moveList, setMoveList] = React.useState<string[]>([]);

  const [boardSide, setBoardSide] = React.useState<BoardSideType>(
    BoardSideType.White
  );
  const [soundList, setSoundList] = React.useState<string[]>([]);

  return (
    <div className="chess">
      <div className="chess-header">
        <Typography.Title className="chess-header-text">Chess</Typography.Title>
        <ActionButtons
          rows={rows}
          positionObject={positionObject}
          setPositionObject={setPositionObject}
          positionObjectList={positionObjectList}
          setPositionObjectList={setPositionObjectList}
          setBoardSide={setBoardSide}
          setMoveList={setMoveList}
          soundList={soundList}
          setSoundList={setSoundList}
        />
      </div>

      <ChessBoard
        rows={rows}
        positionObject={positionObject}
        setPositionObject={setPositionObject}
        positionObjectList={positionObjectList}
        setPositionObjectList={setPositionObjectList}
        boardSide={boardSide}
        moveList={moveList}
        setMoveList={setMoveList}
        soundList={soundList}
        setSoundList={setSoundList}
      />
    </div>
  );
};

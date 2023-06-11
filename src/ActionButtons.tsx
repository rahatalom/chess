import { Tooltip } from "antd";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import React from "react";
import { isEmpty } from "lodash";
import { getInitialPosition } from "./utils";
import { BoardSideType } from "./Chess";
import { ChessPieceType } from "./types";

interface ActionButtonsProps {
  rows: string[][];
  positionObject: Record<string, ChessPieceType>;
  setPositionObject: React.Dispatch<
    React.SetStateAction<Record<string, ChessPieceType>>
  >;
  positionObjectList: Record<string, ChessPieceType>[];
  setPositionObjectList: React.Dispatch<
    React.SetStateAction<Record<string, ChessPieceType>[]>
  >;
  setBoardSide: React.Dispatch<React.SetStateAction<BoardSideType>>;
  setMoveList: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  rows,
  positionObject,
  setPositionObject,
  positionObjectList,
  setPositionObjectList,
  setBoardSide,
  setMoveList,
}) => {
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
    const index = positionObjectList.indexOf(positionObject);
    setPositionObject(
      positionObjectList[index - 1] ?? getInitialPosition(rows)
    );
  }, [positionObjectList, positionObject, rows, setPositionObject]);

  const next = React.useCallback(() => {
    const index = positionObjectList.indexOf(positionObject);
    setPositionObject(
      positionObjectList[index + 1] ??
        positionObjectList[index] ??
        getInitialPosition(rows)
    );
  }, [positionObject, positionObjectList, rows, setPositionObject]);

  return (
    <div className="chess-button-container">
      <Tooltip title="Restart">
        <button
          className="chess-button"
          onClick={() => {
            setPositionObject(getInitialPosition(rows));
            setPositionObjectList([]);
            setMoveList([]);
          }}
        >
          ↺
        </button>
      </Tooltip>
      <button
        className="chess-button"
        disabled={isEmpty(positionObjectList)}
        onClick={() => prev()}
      >
        <Tooltip title="Previous move">
          <CaretLeftOutlined />
        </Tooltip>
      </button>

      <button
        className="chess-button"
        disabled={isEmpty(positionObjectList)}
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
  );
};

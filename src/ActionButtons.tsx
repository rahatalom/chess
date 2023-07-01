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
import useSound from "use-sound";
import move from "./Sounds/move.mp3";
import capture from "./Sounds/capture.mp3";

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
  soundList: string[];
  setSoundList: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  rows,
  positionObject,
  setPositionObject,
  positionObjectList,
  setPositionObjectList,
  setBoardSide,
  setMoveList,
  soundList,
  setSoundList,
}) => {
  const [moveSound] = useSound(move);
  const [captureSound] = useSound(capture);
  const isPositionObjectListEmpty = isEmpty(positionObjectList);

  document.onkeydown = function (e) {
    var keyCode = e.keyCode;
    if (keyCode === 37) {
      prev();
    }
    if (keyCode === 39) {
      next();
    }
  };

  const prev = () => {
    if (isPositionObjectListEmpty) {
      return;
    }
    const index = positionObjectList.indexOf(positionObject);
    setPositionObject(
      positionObjectList[index - 1] ?? getInitialPosition(rows)
    );
    if (soundList[index - 1] === "capture") {
      captureSound();
    }
    if (soundList[index - 1] === "move") {
      moveSound();
    }
  };

  const next = () => {
    if (isPositionObjectListEmpty) {
      return;
    }
    const index = positionObjectList.indexOf(positionObject);
    setPositionObject(
      positionObjectList[index + 1] ??
        positionObjectList[index] ??
        getInitialPosition(rows)
    );
    if (soundList[index + 1] === "capture") {
      captureSound();
    }
    if (soundList[index + 1] === "move") {
      moveSound();
    }
  };

  return (
    <div className="chess-button-container">
      <Tooltip title="Restart">
        <button
          className="chess-button"
          onClick={() => {
            setPositionObject(getInitialPosition(rows));
            setPositionObjectList([]);
            setMoveList([]);
            setSoundList([]);
          }}
        >
          ↺
        </button>
      </Tooltip>
      <button
        className="chess-button"
        disabled={isPositionObjectListEmpty}
        onClick={() => prev()}
      >
        <Tooltip title="Previous move">
          <CaretLeftOutlined />
        </Tooltip>
      </button>

      <button
        className="chess-button"
        disabled={isPositionObjectListEmpty}
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

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



interface ActionButtonsProps {
  rows: string[][];
  positionObject:    Record<string, string>
  setPositionObject: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  list: Record<string, string>[];
  setList: React.Dispatch<React.SetStateAction<Record<string, string>[]>>;
  setBoardSide: React.Dispatch<React.SetStateAction<BoardSideType>>;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  rows,
  positionObject,
  setPositionObject,
  list,
  setList,
  setBoardSide,
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
        const index = list.indexOf(positionObject);
        setPositionObject(list[index - 1] ?? getInitialPosition(rows));
      }, [list, positionObject, rows, setPositionObject]);
    
      const next = React.useCallback(() => {
        const index = list.indexOf(positionObject);
        setPositionObject(
          list[index + 1] ?? list[index] ?? getInitialPosition(rows)
        );
      }, [list, positionObject, rows, setPositionObject]);

  return (
    <div className="chess-button-container">
      <Tooltip title="Restart">
        <button
          className="chess-button"
          onClick={() => {
            setPositionObject(getInitialPosition(rows));
            setList([]);
          }}
        >
          ↺
        </button>
      </Tooltip>
      <button
        className="chess-button"
        disabled={isEmpty(list)}
        onClick={() => prev()}
      >
        <Tooltip title="Previous move">
          <CaretLeftOutlined />
        </Tooltip>
      </button>

      <button
        className="chess-button"
        disabled={isEmpty(list)}
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
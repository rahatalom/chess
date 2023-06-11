import { Popover } from "antd";
import classNames from "classnames";
import React from "react";
import { BoardSideType } from "../Chess";
import { imageObj, lightSquareColor } from "../constants";
import { ChessPieceType } from "../types";
import { getPopoverContent } from "./getPopoverContent";

interface ChessPieceProps {
  piece: ChessPieceType;

  square: string;
  boardSide: BoardSideType;
  selectedPromotionPiece: ChessPieceType | undefined;
  setSelectedPromotionPiece: React.Dispatch<
    React.SetStateAction<ChessPieceType | undefined>
  >;
}

export const ChessPiece: React.FC<ChessPieceProps> = ({
  piece,
  selectedPromotionPiece,
  square,
  boardSide,
  setSelectedPromotionPiece,
}) => {
  const isPromotionPopoverVisible = React.useCallback(
    (square: string, piece: ChessPieceType) => {
      return (
        (square[1] === "1" || square[1] === "8") &&
        (piece === "WPawn" || piece === "BPawn") &&
        !selectedPromotionPiece
      );
    },
    [selectedPromotionPiece]
  );

  return (
    <Popover
      color={lightSquareColor}
      open={isPromotionPopoverVisible(square, piece)}
      content={getPopoverContent(piece, setSelectedPromotionPiece)}
    >
      <img
        className={classNames("chess-board-piece", {
          "chess-board-piece-rotated": boardSide === BoardSideType.Black,
        })}
        src={imageObj[piece]}
        id={square}
        alt={imageObj.BKnight}
      />
    </Popover>
  );
};

import { Popover } from "antd";
import classNames from "classnames";
import React from "react";
import { BoardSideType } from "../Chess";
import { imageObj, lightSquareColor } from "../constants";
import { ChessPieceType } from "../types";
import { getPopoverContent } from "./getPopoverContent";

interface ChessPieceProps {
  piece: ChessPieceType;
  pieceSelected: boolean;
  square: string;
  boardSide: BoardSideType;
  setPieceSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPromotionPiece: React.Dispatch<
    React.SetStateAction<ChessPieceType>
  >;
}

export const ChessPiece: React.FC<ChessPieceProps> = ({
  piece,
  pieceSelected,
  square,
  boardSide,
  setPieceSelected,
  setSelectedPromotionPiece,
}) => {
  const isPromotionPopoverVisible = React.useCallback(
    (square: string, piece: ChessPieceType) => {
      return (
        (square[1] === "1" || square[1] === "8") &&
        (piece === "WPawn" || piece === "BPawn") &&
        !pieceSelected
      );
    },
    [pieceSelected]
  );

  return (
    <Popover
      color={lightSquareColor}
      open={isPromotionPopoverVisible(square, piece)}
      content={getPopoverContent(
        piece,
        setSelectedPromotionPiece,
        setPieceSelected
      )}
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

import { Radio } from "antd";
import { imageObj } from "../constants";
import { ChessPiece } from "../types";

export const getPopoverContent = (
  piece: ChessPiece,
  setSelectedPromotionPiece: React.Dispatch<React.SetStateAction<ChessPiece>>,
  setPieceSelected: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const arrayOfPiece: ChessPiece[] = piece.startsWith("B")
    ? ["BKnight", "BBishop", "BRook", "BQueen"]
    : ["WKnight", "WBishop", "WRook", "WQueen"];

  return (
    <div>
      <Radio.Group>
        {arrayOfPiece.map((promotionPiece, index) => (
          <Radio.Button
            className="chess-promotion-radio-button"
            value={index}
            onClick={() => {
              setSelectedPromotionPiece(promotionPiece);
              setPieceSelected(true);
            }}
          >
            <img
              className="chess-board-promotion-piece"
              src={imageObj[promotionPiece]}
              alt={imageObj.BKnight}
            />
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
};

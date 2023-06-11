import { Radio } from "antd";
import { imageObj } from "../constants";
import { ChessPieceType } from "../types";

export const getPopoverContent = (
  piece: ChessPieceType,
  setSelectedPromotionPiece: React.Dispatch<
    React.SetStateAction<ChessPieceType | undefined>
  >
) => {
  const arrayOfPiece: ChessPieceType[] = piece.startsWith("B")
    ? ["BKnight", "BBishop", "BRook", "BQueen"]
    : ["WKnight", "WBishop", "WRook", "WQueen"];

  return (
    <div>
      <Radio.Group>
        {arrayOfPiece.map((promotionPiece, index) => (
          <Radio.Button
            className="chess-promotion-radio-button"
            defaultChecked={false}
            value={index}
            onClick={() => {
              setSelectedPromotionPiece(promotionPiece);
            }}
          >
            <img
              className="chess-board-promotion-piece"
              src={imageObj[promotionPiece]}
              alt={imageObj.BKnight}
              draggable={false}
            />
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
};

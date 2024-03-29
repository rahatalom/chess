import { ChessPieceType, Url } from "./types";

export const nums = [1, 2, 3, 4, 5, 6, 7, 8];
export const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

export const lightSquareColor = "grey"
export const darkSquareColor = "#3A3845"

export const imageObj: Record<ChessPieceType, Url> = {
  WPawn:
    "https://images.chesscomfiles.com/chess-themes/pieces/light/100/wp.png",
  WKnight:
    "https://images.chesscomfiles.com/chess-themes/pieces/light/100/wn.png",
  WBishop:
    "https://images.chesscomfiles.com/chess-themes/pieces/light/100/wb.png",
  WRook:
    "https://images.chesscomfiles.com/chess-themes/pieces/light/100/wr.png",
  WQueen:
    "https://images.chesscomfiles.com/chess-themes/pieces/light/100/wq.png",
  WKing:
    "https://images.chesscomfiles.com/chess-themes/pieces/light/100/wk.png",
  BPawn:
    "https://images.chesscomfiles.com/chess-themes/pieces/light/100/bp.png",
  BKnight:
    "https://images.chesscomfiles.com/chess-themes/pieces/light/100/bn.png",
  BBishop:
    "https://images.chesscomfiles.com/chess-themes/pieces/light/100/bb.png",
  BRook:
    "https://images.chesscomfiles.com/chess-themes/pieces/light/100/br.png",
  BQueen:
    "https://images.chesscomfiles.com/chess-themes/pieces/light/100/bq.png",
  BKing:
    "https://images.chesscomfiles.com/chess-themes/pieces/light/100/bk.png",
};

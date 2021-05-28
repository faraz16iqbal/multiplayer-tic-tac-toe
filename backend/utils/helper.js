import { v4 as uuidv4 } from "uuid";

export const genRoom = () => {
  return uuidv4().replaceAll("-", "").slice(0, 15).toUpperCase();
  // return "12345";
};

export const randomPiece = () => {
  return Math.random() > 0.5 ? "X" : "O";
};

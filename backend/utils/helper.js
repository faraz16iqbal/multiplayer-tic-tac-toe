import { v4 as uuidv4 } from "uuid";

const randRoom = () => {
  return uuidv4().replaceAll("-", "").slice(0, 15).toUpperCase();
};

const randPiece = () => {
  return Math.random() > 0.5 ? "X" : "O";
};

module.exports = { randRoom, randPiece };

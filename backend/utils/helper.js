import { v4 as uuidv4 } from "uuid";

const genRoom = () => {
  // return uuidv4().replaceAll("-", "").slice(0, 15).toUpperCase();
  return "12345";
};

const randomPiece = () => {
  return Math.random() > 0.5 ? "X" : "O";
};

module.exports = { genRoom, randomPiece };

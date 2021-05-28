const { v4 } = require("uuid");

export const genRoom = () => {
  return v4().replaceAll("-", "").slice(0, 15).toUpperCase();
  // return "12345";
};

export const randomPiece = () => {
  return Math.random() > 0.5 ? "X" : "O";
};

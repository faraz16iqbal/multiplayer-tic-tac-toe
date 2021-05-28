const { v4 } = require("uuid");

const genRoom = () => {
  return v4().replaceAll("-", "").slice(0, 15).toUpperCase();
  // return "12345";
};

const randomPiece = () => {
  return Math.random() > 0.5 ? "X" : "O";
};

module.exports = { genRoom, randomPiece };

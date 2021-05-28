const { v4 } = require("uuid");

// randomly generate 5 characters
const genRoom = () => {
  return v4().replaceAll("-", "").slice(0, 5).toUpperCase();
  // return "12345";
};

const randomPiece = () => {
  return Math.random() > 0.5 ? "X" : "O";
};

module.exports = { genRoom, randomPiece };

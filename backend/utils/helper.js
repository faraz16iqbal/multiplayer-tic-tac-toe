const { v4: uuidv4 } = require("uuid");

// generate unquie id
const genRoom = () => {
  return uuidv4().replaceAll("-", "").slice(0, 5).toUpperCase();
};

const randomPiece = () => {
  return Math.random() > 0.5 ? "X" : "O";
};

module.exports = { genRoom, randomPiece };

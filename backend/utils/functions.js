const { genRoom, randomPiece } = require("./helper.js");
const Board = require("./board");
// import { rooms } from "../server.js";

// map to store room data {roomid:str, players:Array(2)}
let rooms = new Map();

const makeNewRoom = () => {
  let newRoom = genRoom();
  while (rooms.has(newRoom)) {
    newRoom = genRoom();
  }

  rooms.set(newRoom, { roomId: newRoom, players: [], board: null });
  return newRoom;
};

const joinRoom = async (player, room) => {
  try {
    let currentRoom = rooms.get(room);
    currentRoom.players.push(player);
    rooms.set(room, { ...currentRoom, players: updatedPlayerList });
  } catch (e) {
    console.log("No such room found!");
  }
};

const quit = (room) => {
  let tempRoom = rooms.get(room);
  tempRoom.players.pop();
};

const getNumOfPlayers = (room) => {
  try {
    console.log(rooms.get(room).players);
    return rooms.get(room).players.length;
  } catch (error) {
    console.log("No matching id found");
  }
};

const assignPiece = (room) => {
  const firstPiece = randomPiece();
  const lastPiece = firstPiece === "X" ? "O" : "X";

  let currentRoom = rooms.get(room);
  currentRoom.players[0].piece = firstPiece;
  currentRoom.players[1].piece = lastPiece;
};

const newGame = (room) => {
  let currentRoom = rooms.get(room);
  const board = new Board();
  currentRoom.board = board;
};

module.exports = {
  newGame,
  assignPiece,
  getNumOfPlayers,
  quit,
  joinRoom,
  makeNewRoom,
  rooms,
};

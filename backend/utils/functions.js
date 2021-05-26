import { genRoom, randomPiece } from "./helper.js";
import Board from "./board.js";
// import { rooms } from "../server.js";

// map to store room data {roomid:str, players:Array(2)}
export let rooms = new Map();

export const makeNewRoom = async () => {
  let newRoom = await genRoom();
  while (rooms.has(newRoom)) {
    newRoom = await genRoom();
  }

  rooms.set(newRoom, { roomId: newRoom, players: [], board: null });
  return newRoom;
};

export const joinRoom = async (player, room) => {
  try {
    let currentRoom = rooms.get(room);
    currentRoom.players.push(player);
    rooms.set(room, { ...currentRoom, players: updatedPlayerList });
  } catch (e) {
    console.log("No such room found!");
  }
};

export const quit = (room) => {
  let tempRoom = rooms.get(room);
  tempRoom.players.pop();
};

export const getNumOfPlayers = (room) => {
  try {
    console.log(rooms.get(room).players);
    return rooms.get(room).players.length;
  } catch (error) {
    console.log("No matching id found");
  }
};

export const assignPiece = (room) => {
  const firstPiece = randomPiece();
  const lastPiece = firstPiece === "X" ? "O" : "X";

  let currentRoom = rooms.get(room);
  currentRoom.players[0].piece = firstPiece;
  currentRoom.players[1].piece = lastPiece;
};

export const newGame = (room) => {
  let currentRoom = rooms.get(room);
  const board = new Board();
  currentRoom.board = board;
};

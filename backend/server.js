import cors from "cors";
import Player from "./utils/player.js";
import Board from "./utils/board.js";
import { genRoom, randomPiece } from "./utils/helper.js";
const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

app.use(cors());

// map to store room data {roomid:str, players:Array(2)}
let rooms = new Map();

// let newRoom = new
const makeNewRoom = async () => {
  let newRoom = await genRoom();
  while (rooms.has(newRoom)) {
    newRoom = await genRoom();
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

const asignPiece = (room) => {
  const firstPiece = randPiece();
  const lastPiece = firstPiece === "X" ? "O" : "X";

  let currentRoom = rooms.get(room);
  currentRoom.players[0].piece = firstPiece;
  currentRoom.players[1].piece = lastPiece;
};

io.on("connection", (socket) => {
  console.log("a user has entered");
  socket.emit("connected", { id: socket.id }); // STEP 5 ::=> Notify request cllient that it is not connected with server

  //test
  socket.on("test", (msg) => {
    io.emit("message", msg);
  });

  // working
  socket.on("newGame", async () => {
    const room = await makeNewRoom();
    socket.emit("newGameCreated", room);
  });

  socket.on("newRoomJoin", async ({ room, name }) => {
    if (room === "" || name === "") {
      io.to(socket.id).emit("joinError");
    }

    //Put the new player into the room
    socket.join(room);
    const id = socket.id;
    const newPlayer = new Player(name, room, id);
    await joinRoom(newPlayer, room);

    //Get the number of player in the room
    const peopleInRoom = getNumOfPlayers(room);
    console.log(peopleInRoom);

    //Need another player so emit the waiting event
    //to display the wait screen on the front end
    if (peopleInRoom === 1) {
      console.log("HERE");
      io.to(room).emit("waiting");
    }
    //The right amount of people so we start the game
    else if (peopleInRoom === 2) {
      //Assign the piece to each player in the backend data structure and then
      //emit it to each of the player so they can store it in their state
      console.log("HERE2");

      asignPiece(room);
      currentPlayers = await rooms.get(room).players;
      for (const player of currentPlayers) {
        io.to(player.id).emit("pieceAssignment", {
          piece: player.piece,
          id: player.id,
        });
      }
      // newGame(room);

      // //When starting, the game state, turn and the list of both players in
      // //the room are required in the front end to render the correct information
      // const currentRoom = rooms.get(room);
      // const gameState = currentRoom.board.game;
      // const turn = currentRoom.board.turn;
      // const players = currentRoom.players.map((player) => [
      //   player.id,
      //   player.name,
      // ]);
      // io.to(room).emit("starting", { gameState, players, turn });
    }

    //Too many people so we kick them out of the room and redirect
    //them to the main starting page
    else if (peopleInRoom === 3) {
      console.log("HERE3");

      socket.leave(room);
      kick(room);
      io.to(socket.id).emit("joinError");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () =>
  console.log(`Server running on : http://localhost:${PORT}`)
);

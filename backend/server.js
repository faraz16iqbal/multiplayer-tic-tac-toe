import cors from "cors";
import Player from "./utils/player.js";
import Board from "./utils/board.js";
const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

import {
  rooms,
  makeNewRoom,
  joinRoom,
  newGame,
  quit,
  getNumOfPlayers,
  assignPiece,
} from "./utils/functions";

app.use(cors());

// SOCKET LOGIC

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

    if (peopleInRoom === 1) {
      console.log("HERE");
      io.to(room).emit("waiting");
    }
    //The right amount of people so we start the game
    else if (peopleInRoom === 2) {
      //Assign the piece to each player in the backend data structure and then
      //emit it to each of the player so they can store it in their state

      assignPiece(room);
      console.log("HERE2");
      const currentPlayers = rooms.get(room).players;
      for (const player of currentPlayers) {
        io.to(player.id).emit("pieceAssignment", {
          piece: player.piece,
          id: player.id,
        });
      }

      // start game
      newGame(room);

      const currentRoom = rooms.get(room);
      const gameState = currentRoom.board.game;
      const turn = currentRoom.board.turn;
      const players = currentRoom.players.map((player) => [
        player.id,
        player.name,
      ]);
      io.to(room).emit("starting", { gameState, players, turn });
    } else if (peopleInRoom === 3) {
      socket.leave(room);
      kick(room);
      io.to(socket.id).emit("joinError");
    }

    socket.on("move", ({ room, piece, index }) => {
      currentBoard = rooms.get(room).board;
      currentBoard.move(index, piece);

      if (currentBoard.checkWinner(piece)) {
        io.to(room).emit("winner", {
          gameState: currentBoard.game,
          id: socket.id,
        });
      } else if (currentBoard.checkDraw()) {
        io.to(room).emit("draw", { gameState: currentBoard.game });
      } else {
        currentBoard.switchTurn();
        io.to(room).emit("update", {
          gameState: currentBoard.game,
          turn: currentBoard.turn,
        });
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () =>
  console.log(`Server running on : http://localhost:${PORT}`)
);

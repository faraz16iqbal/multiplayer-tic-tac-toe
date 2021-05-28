const cors = require("cors");
const dotenv = require("dotenv");
const Player = require("./utils/player.js");
const app = require("express")();
const httpServer = require("http").createServer(app);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"],
  },
  allowEIO3: true,
});
const {
  rooms,
  makeNewRoom,
  joinRoom,
  newGame,
  quit,
  getNumOfPlayers,
  assignPiece,
} = require("./utils/functions.js");

dotenv.config();
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

  //On the client submit event (on start page) to join a room
  socket.on("joining", ({ room }) => {
    if (rooms.has(room)) {
      socket.emit("joinConfirmed");
    } else {
      socket.emit("errorMessage", "No room with that id found");
    }
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
    } else if (peopleInRoom >= 3) {
      socket.leave(room);
      quit(room);
      io.to(socket.id).emit("joinError");
    }

    // game logic
    socket.on("move", ({ room, piece, index }) => {
      let currentBoard = rooms.get(room).board;
      currentBoard.move(index, piece);

      const win = currentBoard.checkWinner(piece);

      if (win !== false) {
        // set board to winning state
        let winState = new Array(9).fill(null);
        winState = currentBoard.game.map((w, id) => {
          if (win.includes(id)) {
            return w;
          }
          return null;
        });

        console.log(winState);
        console.log(currentBoard.game);

        io.to(room).emit("winner", {
          gameState: winState,
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

  socket.on("disconnecting", () => {
    console.log("User disconnected");
    //Get all the rooms that the socket is currently subscribed to
    const currentRooms = Object.keys(socket.rooms);
    //In this game an object can only have 2 rooms max so we check for that
    if (currentRooms.length === 2) {
      //The game room is always the second element of the list
      const room = currentRooms[1];
      const num = getRoomPlayersNum(room);
      //If one then no one is left so we remove the room from the mapping
      if (num === 1) {
        rooms.delete(room);
      }
      //If 2 then there is one person left so we remove the socket leaving from the player list and
      //emit a waiting event to the other person
      if (num === 2) {
        currentRoom = rooms.get(room);
        currentRoom.players = currentRoom.players.filter(
          (player) => player.id !== socket.id
        );
        io.to(room).emit("waiting");
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () =>
  console.log(`Server running on : http://localhost:${PORT}`)
);

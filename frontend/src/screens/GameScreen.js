/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import qs from "qs";

import { socket } from "../config/socket";

const GameScreen = ({ history, location }) => {
  const [game, setGame] = useState(new Array(9).fill(null));
  const [piece, setPiece] = useState("X");
  const [turn, setTurn] = useState(true);
  const [end, setEnd] = useState(false);
  const [room, setRoom] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [playerScore, setPlayerScore] = useState(0);
  const [opponent, setOpponent] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [joinError, setJoinError] = useState(false);
  const [socketID, setSocketID] = useState(null);

  useEffect(() => {
    const { room, name } = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });

    setRoom(room);
    socket.emit("newRoomJoin", { room, name });

    // logic to wait or start the game

    socket.emit("waiting", () => {
      setWaiting(true);
      setPlayerScore(0);
      setOpponent([]);
    });

    socket.on("starting", ({ gameState, players, turn }) => {
      setWaiting("false");
      gameStart(gameState, players, turn);
    });
    socket.on("joinError", () => setJoinError(true));

    if (joinError) {
      history.push("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joinError]);

  const gameStart = (gameState, players, turn) => {
    const opponent = players.filter(([id, name]) => id !== socketID)[0][1];

    this.setState({ opponentPlayer: [opponent, 0], end: false });
    setOpponent([opponent, 0]);
    setEnd(false);
    setGame(gameState);
    handleTurn(turn);
    handleMessage();
  };

  function handleTurn(turn) {
    if (piece === turn) {
      setTurn(true);
    } else {
      setTurn(false);
    }
  }

  function handleMessage() {
    const msg = turn ? "Your Turn " : `${opponent[0]}'s Turn`;
    setStatusMsg(msg);
  }
  return <div>GAME SCREEN</div>;
};

export default GameScreen;

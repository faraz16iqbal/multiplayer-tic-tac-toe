/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import qs from "qs";

import { socket } from "../config/socket";
import Wait from "../components/Wait";
import Square from "../components/Square";
import { Container } from "react-bootstrap";
class GameSreen extends Component {
  state = {
    game: new Array(9).fill(null),
    piece: "X",
    turn: true,
    end: false,
    room: "",
    statusMessage: "",
    currentPlayerScore: 0,
    opponentPlayer: [],
    waiting: false,
    joinError: false,
  };
  socketID = null;

  componentDidMount() {
    this.socket = socket;
    const { room, name } = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });
    this.setState({ room });
    this.socket.emit("newRoomJoin", { room, name });

    //New user join, logic decide on backend whether to display
    //the actual game or the wait screen or redirect back to the main page
    this.socket.on("waiting", () =>
      this.setState({
        waiting: true,
        currentPlayerScore: 0,
        opponentPlayer: [],
      })
    );
    this.socket.on("starting", ({ gameState, players, turn }) => {
      this.setState({ waiting: false });
      this.gameStart(gameState, players, turn);
    });
    this.socket.on("joinError", () => this.setState({ joinError: true }));

    //Listening to the assignment of piece store the piece along with the in state
    //socket id in local socketID variable
    this.socket.on("pieceAssignment", ({ piece, id }) => {
      this.setState({ piece: piece });
      this.socketID = id;
    });

    //Game play logic events
    this.socket.on("update", ({ gameState, turn }) =>
      this.handleUpdate(gameState, turn)
    );
    this.socket.on("winner", ({ gameState, id, winState }) =>
      this.handleWin(id, gameState)
    );
    this.socket.on("draw", ({ gameState }) => this.handleDraw(gameState));

    this.socket.on("restart", ({ gameState, turn }) =>
      this.handleRestart(gameState, turn)
    );
  }

  //Setting the states to start a game when new user join
  gameStart(gameState, players, turn) {
    const opponent = players.filter(([id, name]) => id !== this.socketID)[0][1];
    this.setState({ opponentPlayer: [opponent, 0], end: false });
    this.setBoard(gameState);
    this.setTurn(turn);
    this.setMessage();
  }

  //When some one make a move, emit the event to the back end for handling
  handleClick = (index) => {
    const { game, piece, end, turn, room } = this.state;
    if (!game[index] && !end && turn) {
      this.socket.emit("move", { room, piece, index });
      console.log(game, piece, end, turn, room);
    }
  };

  //Setting the states each move when the game haven't ended (no wins or draw)
  handleUpdate(gameState, turn) {
    this.setBoard(gameState);
    this.setTurn(turn);
    this.setMessage();
  }

  //Setting the states when some one wins
  handleWin(id, gameState) {
    this.setBoard(gameState);
    if (this.socketID === id) {
      const playerScore = this.state.currentPlayerScore + 1;
      this.setState({
        currentPlayerScore: playerScore,
        statusMessage: "You Win",
      });
    } else {
      const opponentScore = this.state.opponentPlayer[1] + 1;
      const opponent = this.state.opponentPlayer;
      opponent[1] = opponentScore;
      this.setState({
        opponentPlayer: opponent,
        statusMessage: `${this.state.opponentPlayer[0]} Wins`,
      });
    }
    this.setState({ end: true });
  }

  //Setting the states when there is a draw at the end
  handleDraw(gameState) {
    this.setBoard(gameState);
    this.setState({ end: true, statusMessage: "Draw" });
  }

  setMessage() {
    const message = this.state.turn
      ? "Your Turn"
      : `${this.state.opponentPlayer[0]}'s Turn`;
    this.setState({ statusMessage: message });
  }

  setTurn(turn) {
    if (this.state.piece === turn) {
      this.setState({ turn: true });
    } else {
      this.setState({ turn: false });
    }
  }

  setBoard(gameState) {
    this.setState({ game: gameState });
  }
  renderSquare(i) {
    const { game, piece, turn, end } = this.state;

    return (
      <Square
        key={i}
        value={game[i]}
        player={piece}
        end={end}
        id={i}
        onClick={this.handleClick}
        turn={turn}
      />
    );
  }

  render() {
    const { history } = this.props;
    const {
      game,
      piece,
      joinError,
      waiting,
      room,
      turn,
      opponentPlayer,
      currentPlayerScore,
      end,
      statusMessage,
    } = this.state;

    if (joinError) {
      alert("Error while joining, redirecting to home page!");
      history.push("/");
    } else {
      const squareArray = [];
      for (let i = 0; i < 9; i++) {
        const newSquare = this.renderSquare(i);
        squareArray.push(newSquare);
      }
      return (
        <Container className="d-flex flex-column align-items-center justify-content-center choice-container">
          <Wait display={this.state.waiting} room={this.state.room} />
          <p className="turn">{statusMessage}</p>
          <div className="board">{squareArray}</div>
          {/* <ScoreBoard data={{player1:['You', this.state.currentPlayerScore], player2:[this.state.opponentPlayer[0], this.state.opponentPlayer[1]]}}/>
          <PlayAgain end={this.state.end} onClick={this.playAgainRequest}/> */}{" "}
          */}
        </Container>
      );
    }
  }
}

export default GameSreen;

import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Choice from "../components/Choice";
import Error from "../components/Error";
import InputForm from "../components/InputForm";
import Loading from "../components/Loading";
import { socket } from "../config/socket";

import logo from "../images/logo.png";

const HomeScreen = ({ history }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [newGame, setNewgame] = useState(null);
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverConfirmed, setServerConfirmed] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    socket.on("newGameCreated", (room) => {
      setRoom(room);
      setServerConfirmed(true);
    });

    socket.on("joinConfirmed", () => {
      setServerConfirmed(true);
    });

    if (serverConfirmed) {
      history.push(`/game?room=${room}&name=${name}`);
    }
    // create display error function
    socket.on("errorMessage", (msg) => {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverConfirmed]);

  // functions

  const onChoice = (choice) => {
    const gameChoice = choice === "new" ? true : false;
    setNewgame(gameChoice);
    console.log(gameChoice);
    stepForward();
  };

  const stepBack = () => {
    setStep((prev) => prev - 1);
  };

  const stepForward = () => {
    setStep((prev) => prev + 1);
  };

  const onTyping = (e) => {
    setName(e.target.value);
  };

  const validate = () => {
    if (newGame) {
      return !(name === "");
    } else {
      return !(name === "") && !(room === "");
    }
  };

  const onSubmit = () => {
    setLoading(true);
    if (validate()) {
      if (newGame) {
        console.log("here");
        socket.emit("newGame");
      } else {
        socket.emit("joining", { room });
      }
    } else {
      console.log("here1");

      setTimeout(() => setLoading(false), 1000);
      displayError(
        newGame
          ? "Please fill out your name"
          : "Please fill out your name and room id"
      );
    }
  };

  const displayError = (message) => {
    setError(true);
    setErrorMessage(message);
    setLoading(false);

    // remove error after a while
    setTimeout(() => {
      setError(false);
      setErrorMessage("");
    }, 1000);
  };

  return (
    <>
      {step === 1 ? (
        <Choice logo={logo} onChoice={onChoice} />
      ) : step === 2 ? (
        <Container className="d-flex flex-column align-items-center justify-content-center choice-container">
          <Loading loading={loading} />
          <Error display={error} message={errorMessage} />
          <InputForm
            stepBack={stepBack}
            onSubmit={onSubmit}
            onTyping={onTyping}
            newGame={newGame}
            name={name}
            room={room}
          />
        </Container>
      ) : (
        ""
      )}
    </>
  );
};

export default HomeScreen;

import React from "react";
import { Container } from "react-bootstrap";
import ChoiceButton from "./ChoiceButton";

const Choice = ({ logo, onChoice }) => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center choice-container">
      <a href="/">
        <img src={logo} alt="React TicTacToe" className="mb-4" />
      </a>

      <ChoiceButton
        onChoice={onChoice}
        type="primary"
        choice="new"
        label="Start New"
      />
      <ChoiceButton
        onChoice={onChoice}
        type="secondary"
        choice="join"
        label="Join Game"
      />
    </Container>
  );
};

export default Choice;

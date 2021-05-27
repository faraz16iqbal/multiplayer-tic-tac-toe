import React from "react";
import { Button } from "react-bootstrap";

const ChoiceButton = ({ type, choice, label, onChoice }) => {
  return (
    <Button
      variant={type}
      className="mt-4 px-5 py-2 mx-2"
      style={{ fontSize: "1.5rem" }}
      onClick={() => onChoice(choice)}
    >
      {label}
    </Button>
  );
};

export default ChoiceButton;

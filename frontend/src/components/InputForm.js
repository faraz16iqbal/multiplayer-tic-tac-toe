import React from "react";
import Input from "./Input.js";
import ChoiceButton from "./ChoiceButton";

const InputForm = (props) => {
  const { stepBack, onSubmit, onTyping, newGame, name, room } = props;

  return (
    <>
      <Input
        name="name"
        placeholder="Your Name..."
        onChange={onTyping}
        value={name}
      />
      {!newGame ? (
        <Input
          name="room"
          placeholder="Room ID..."
          onChange={onTyping}
          value={room}
        />
      ) : (
        ""
      )}
      <div>
        <ChoiceButton
          type="danger"
          choice="back"
          onChoice={stepBack}
          label="Back"
        />
        <ChoiceButton
          type="warning"
          choice="submit"
          onChoice={onSubmit}
          label="Let's Go"
        />
      </div>
    </>
  );
};

export default InputForm;

import React, { useState, useEffect, useRef } from "react";
import { socket } from "./utils/socket";
import "./App.css";

const App = () => {
  const [yourID, setYourID] = useState(null);
  const [message, setMessage] = useState(null);
  const [choice, setChoice] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    socket.on("connected", (data) => {
      setYourID(data.id);
    });

    socket.on("message", (m) => {
      setMessage(m);
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const messageObj = {
      body: msg,
      id: yourID,
    };
    console.log(messageObj);

    setMsg("");
    socket.emit("test", messageObj);
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <h1>
        {" "}
        {message && message.id === yourID ? "You" : "User"} :{" "}
        {message && message.body}
      </h1>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import { socket } from "./utils/socket";
import "./App.css";

const App = () => {
  const [yourID, setYourID] = useState(null);
  const [message, setMessage] = useState(null);
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    socket.on("connected", (data) => {
      setYourID(data.id);
    });

    socket.on("message", (m) => {
      setMessage(m);
    });

    socket.on("newGameCreated", (temp) => {
      console.log(temp);
      setRoom(temp);
    });
    // socket.on("newRoomJoin", (data) => {
    //   console.log(data);
    //   // setRoom(temp);
    // });
    socket.on("waiting", () => {
      console.log("WAITING");
      // setRoom(temp);
    });
    socket.on("pieceAssignment", (data) => {
      console.log(data);
      // setRoom(temp);
    });
  }, []);

  function joinRoom(e) {
    e.preventDefault();
    const roomObj = {
      name,
      room,
    };

    setRoom("");
    setName("");
    socket.emit("newRoomJoin", roomObj);
  }

  const newRoom = (e) => {
    e.preventDefault();
    socket.emit("newGame");
  };

  return (
    <div className="App">
      <form onSubmit={joinRoom}>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter code to join room"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button type="submit">Join Room</button>
      </form>
      <button onClick={newRoom} type="submit">
        New Room
      </button>

      <h1>
        {" "}
        {message && message.id === yourID ? "You" : "User"} :{" "}
        {message && message.body}
      </h1>
    </div>
  );
};

export default App;

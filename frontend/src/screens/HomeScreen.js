import React, { Component } from "react";
import { socket } from "../config/socket";

export default class HomeScreen extends Component {
  state = {
    step: 1,
    name: "",
    newGame: null,
    room: "",
    loading: false,
    serverConfirmed: false,
    error: false,
    errorMessage: "",
  };

  componentDidMount() {}

  render() {
    return <div>Hello </div>;
  }
}

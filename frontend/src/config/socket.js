import io from "socket.io-client";
// const SOCKET_URL = "https://faraz-tic-tac-toe.herokuapp.com";
const SOCKET_URL = "http://localhost:5000";

console.log(SOCKET_URL);
export const socket = io(SOCKET_URL, {
  withCredentials: true,
});

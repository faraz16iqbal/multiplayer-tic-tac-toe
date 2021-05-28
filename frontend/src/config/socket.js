import io from "socket.io-client";
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

console.log(SOCKET_URL);
export const socket = io(SOCKET_URL, {
  withCredentials: true,
});

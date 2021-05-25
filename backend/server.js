import { v4 as uuidv4 } from 'uuid';
import { winCombinations } from './utils/combinations.js';
const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
process.setMaxListeners(0);

const id = uuidv4().replaceAll('-', '').slice(0, 10).toUpperCase();
console.log(id);

io.on('connection', (socket) => {
  console.log('a user has entered');
  //   socket.emit('connected', { id: socket.id }); // STEP 5 ::=> Notify request cllient that it is not connected with server

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () =>
  console.log(`Server running on : http://localhost:${PORT}`)
);

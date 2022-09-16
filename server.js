const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { PeerServer } = require('peer');
const cors = require('cors');
require('./src/config/database');
const user_routes = require('./src/user/users.routes');
const io = new Server(server);
const port = process.env.PORT || 8191;
function generateClientId(params) {
  // return `${Math.random().toFixed().toString(3) + `${Math.ceil(Math.random())}`.substr(1, 5)}`
  // return `${String.fromCharCode(Math.random() * (123 - 97) + 97)}`
  return (Math.random().toString(36) + '0000000000000000000').substr(2, 16);
}
const peerServer = PeerServer({ path: '/peer-server', port: process.env.PEER_PORT || 9181, generateClientId }, peerServer => console.log(`Peer server is listening on port ${process.env.PEER_PORT}`));
let peerIds = [];
// const peerServer = ExpressPeerServer(server, { path: '/peer-server', port: 9181 });
peerServer.on('connection', (client) => console.log('[peerServer].connection', client.getId()));
peerServer.on('disconnect', (client) => console.log('[peerServer].disconnect', client.getId()));
peerServer.on('error', err => console.log('[peerServer].error', err));
// app.use('/peerjs', peerServer);
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use(cors())
app.use('/User', user_routes);

io.on('connection', (socket) => {
  console.log('A socket client connected', socket.id);
  io.emit('connected', socket.id)

  socket.on('send_message', (data) => {
    console.log("received message in server side", data)
    // console.log('messages', messages);
    io.emit('received_message', data)
  })

  socket.on('disconnect', () => {
    console.log('A socket user disconnected');
  });

});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
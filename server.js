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
PeerServer({ path: '/peer-server', port: process.env.PEER_PORT || 9181 }, peerServer => console.log(`Peer server is listening on port ${process.env.PEER_PORT}`));
let peerIds = [];
// const peerServer = ExpressPeerServer(server, { path: '/peer-server', port: 9181 });
// peerServer.on('connection', (client) => { console.log('[peerServer].connection', client); });
// peerServer.on('disconnect', (client) => { console.log('[peerServer].disconnect', client); });
// app.use('/peerjs', peerServer);
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use(cors())
app.use('/User', user_routes);

io.on('connection', (socket) => {
  console.log('A socket user connected', socket.id);


  socket.on('send_message', (data) => {
    console.log("received message in server side", data)
    // console.log('messages', messages);
    io.emit('received_message', data)
  })

  socket.on('disconnect', () => {
    console.log('A socket user disconnected');
  });
  socket.on('send_peerId', (peerId) => {
    // console.log('peerId recieved :', peerId);
    peerIds.push(`${peerId}`)
    console.log('peerIds :', peerIds);
    // io.emit('recieved_peerId', peerId)
  });
  socket.on('get_partner_peerId', (peerId) => {
    let partner_peerId = [...peerIds].filter(x => x !== peerId);
    console.log('partner_peerId :', partner_peerId);
    io.emit('partner_peerId', partner_peerId[0])
  });

});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
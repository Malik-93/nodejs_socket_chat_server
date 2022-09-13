const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { ExpressPeerServer } = require('peer');
// require('./src/config/database');
const user_routes = require('./src/user/users.routes');
const io = new Server(server);
const port = process.env.PORT || 8191;
const peerServer = ExpressPeerServer(server, { path: '/peer-server' });
peerServer.on('connection', (client) => { console.log('[peerServer].connection', client); });
peerServer.on('disconnect', (client) => { console.log('[peerServer].disconnect', client); });
app.use('/peerjs', peerServer);
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use('/User', user_routes)
io.on('connection', (socket) => {
  console.log('a user connected');


  socket.on('send_message', (data) => {
    console.log("received message in server side", data)
    io.emit('received_message', data)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
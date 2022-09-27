const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const http = require('http');
const cors = require('cors');
const initPeer = require('./src/peer');
const initSocketIO = require('./src/socket');
const user_routes = require('./src/user/users.routes');
// const { get_network_ip } = require('./src/utils');
// const localNetworkIP = get_network_ip();
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT;
require('./src/config/database');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use(cors())
app.use('/User', user_routes);
const server = http.createServer(app);
// INIT SOCKET IO CONNECTIONS
initSocketIO(server);
// INIT PEER SERVER CONNECTIONS
initPeer();

server.listen(PORT, () => {
  console.log(`Server is listening at ${process.env.CLOUD_SERVER_URL} using PORT ${process.env.PORT}`);
});
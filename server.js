const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const http = require('http');
const cors = require('cors');
const initPeer = require('./src/peer');
const initSocketIO = require('./src/socket');
const user_routes = require('./src/user/users.routes');
const { get_network_ip } = require('./src/utils');
const PORT = process.env.STABLE_LOCAL_BRANCH_SERVER_AND_SOCKET_PORT || 8191;
const localNetworkIP = get_network_ip();
const dotenv = require('dotenv');
dotenv.config();
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
initPeer(localNetworkIP);
server.listen(PORT, `${localNetworkIP}`, () => {
  console.log(`Server is listening at ipv4 http://${localNetworkIP}:${PORT}/`);
});
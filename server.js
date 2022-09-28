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
const { get_network_ip } = require('./src/utils');
dotenv.config();
const PORT = process.env.PORT;
const is_dev = process.env.NODE_ENV === 'development';
require('./src/config/database');
app.enable('trust proxy');
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
const peerServer = initPeer(server);
// console.log('peerServer', peerServer);
app.use('/peer-server', peerServer);

if (is_dev) {
  const networkIP = get_network_ip();
  server.listen(PORT, `${networkIP}`, () => {
    console.log(`Server is listening at ipv4 http://${networkIP}:${PORT}/`);
  });
} else {
  server.listen(PORT, () => {
    console.log(`Server is listening at ${process.env.CLOUD_SERVER_URL} using PORT ${process.env.PORT}`);
  });
}
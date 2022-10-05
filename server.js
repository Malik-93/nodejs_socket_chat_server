const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const http = require('http');
const cors = require('cors');
const ngrok = require('ngrok');
const initPeer = require('./src/peer');
const initSocketIO = require('./src/socket');
const user_routes = require('./src/user/users.routes');
const { get_network_ip } = require('./src/utils');
const localNetworkIP = get_network_ip();
const PORT = process.env.NGROK_BRANCH_SERVER_AND_SOCKET_PORT || 8191;
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

const ngrok_options = {
  proto: 'http', // http|tcp|tls, defaults to http
  addr: PORT, // port or network address, defaults to 80
  authtoken: `${process.env.NGROK_AUTH_TOKEN}`, // your authtoken from ngrok.com
  // subdomain: 'alex', // reserved tunnel name https://alex.ngrok.io
  // auth: 'user:pwd', // http basic authentication for tunnel
  // region: 'us', // one of ngrok regions (us, eu, au, ap, sa, jp, in), defaults to us
  // configPath: '~/git/project/ngrok.yml', // custom path for ngrok config file
  // binPath: path => path.replace('app.asar', 'app.asar.unpacked'), // custom binary path, eg for prod in electron
  // onStatusChange: status => { }, // 'closed' - connection is lost, 'connected' - reconnected
  // onLogEvent: data => { }, // returns stdout messages from ngrok process
};
(async function () {
  const url = await ngrok.connect(ngrok_options);
  console.log('__ngrok_public_url__', url);
})();
server.listen(PORT, () => {
  console.log(`Server is listening at ipv4 http://${localNetworkIP}:${PORT}/`);
});
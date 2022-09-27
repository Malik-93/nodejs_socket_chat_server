const { PeerServer } = require('peer');
const fs = require('fs');
const path = require('path');
module.exports = (localNetworkIP = '') => {
    function generateClientId() {
        return (Math.random().toString(36) + '0000000000000000000').substr(2, 16);
    }
    const peerServer = PeerServer({
        path: '/peer-server',
        port: process.env.PEER_PORT || 9181,
        generateClientId,
        ssl: {
            key: fs.readFileSync(path.join(__dirname, '/local-https-cert/ssl.key')),
            cert: fs.readFileSync(path.join(__dirname, '/local-https-cert/ssl.cert'))
        }
    },
        (peerServer) => console.log(`Peer server is listening at ${process.env.CLOUD_SERVER_URL} using PORT ${process.env.PEER_PORT}`));
    // const peerServer = ExpressPeerServer(server, { path: '/peer-server', port: 9181 });
    peerServer.on('connection', (client) => console.log('[peerServer].connection', client.getId()));
    peerServer.on('disconnect', (client) => console.log('[peerServer].disconnect', client.getId()));
    peerServer.on('error', err => console.log('[peerServer].error', err));
    // app.use('/peerjs', peerServer);
}
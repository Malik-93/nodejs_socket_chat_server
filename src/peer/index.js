const { ExpressPeerServer } = require('peer');
const fs = require('fs');
const path = require('path');
module.exports = (server) => {
    function generateClientId() {
        return (Math.random().toString(36) + '0000000000000000000').substr(2, 16);
    }
    const peerServer = ExpressPeerServer(server, {
        path: '/peer-server',
        port: process.env.PEER_PORT || 9181,
        generateClientId,
        ssl: {
            key: fs.readFileSync(path.join(__dirname, '/local-https-cert/ssl.key')),
            cert: fs.readFileSync(path.join(__dirname, '/local-https-cert/ssl.cert'))
        }
    });
    // const peerServer = ExpressPeerServer(server, { path: '/peer-server', port: 9181 });
    peerServer.on('connection', (client) => console.log('[peerServer].connection', client.getId()));
    peerServer.on('disconnect', (client) => console.log('[peerServer].disconnect', client.getId()));
    peerServer.on('error', err => console.log('[peerServer].error', err));
    return peerServer;
    // app.use('/peerjs', peerServer);
}
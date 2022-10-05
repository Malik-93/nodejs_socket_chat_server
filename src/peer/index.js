const { PeerServer } = require('peer');
module.exports = (localNetworkIP = '') => {
    function generateClientId(params) {
        // return `${Math.random().toFixed().toString(3) + `${Math.ceil(Math.random())}`.substr(1, 5)}`
        // return `${String.fromCharCode(Math.random() * (123 - 97) + 97)}`
        return (Math.random().toString(36) + '0000000000000000000').substr(2, 16);
    }
    const peerServer = PeerServer({ path: '/peer-server', port: process.env.STABLE_LOCAL_BRANCH_PEER_PORT || 9181, generateClientId }, peerServer => console.log(`Peer server is listening at ipv4 ${localNetworkIP}:${process.env.STABLE_LOCAL_BRANCH_PEER_PORT}`));
    // const peerServer = ExpressPeerServer(server, { path: '/peer-server', port: 9181 });
    peerServer.on('connection', (client) => console.log('[peerServer].connection', client.getId()));
    peerServer.on('disconnect', (client) => console.log('[peerServer].disconnect', client.getId()));
    peerServer.on('error', err => console.log('[peerServer].error', err));
    // app.use('/peerjs', peerServer);
}
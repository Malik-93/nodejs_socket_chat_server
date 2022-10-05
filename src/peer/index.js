const { PeerServer } = require('peer');
module.exports = (localNetworkIP = '') => {
    function generateClientId() {
        const _peer_id_ = (Math.random().toString(36) + '0000000000000000000').substr(2, 16);
        console.log('_peer_id_', _peer_id_);
        return _peer_id_
    }
    const peerServer = PeerServer({ path: '/', generateClientId }, _peer_server => console.log('_peer_server is up at root...'));
    // const peerServer = ExpressPeerServer(server, { path: '/peer-server', port: 9181 });
    peerServer.on('connection', (client) => console.log('[peerServer].connection', client.getId()));
    peerServer.on('disconnect', (client) => console.log('[peerServer].disconnect', client.getId()));
    peerServer.on('error', err => console.log('[peerServer].error', err));
    // app.use('/peerjs', peerServer);

    console.log()
}
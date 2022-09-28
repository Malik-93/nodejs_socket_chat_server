const { Server } = require("socket.io");
const { find_user, update_existing_user } = require('../user/user.modules');
const { update_user_connections } = require("../utils");
module.exports = server => {
    const io = new Server(server);

    // SOCKET AUTH MIDDLEWARE START

    // io.use(function(socket, next){
    //   if (socket.handshake.query && socket.handshake.query.token){
    //     jwt.verify(socket.handshake.query.token, 'SECRET_KEY', function(err, decoded) {
    //       if (err) return next(new Error('Authentication error'));
    //       socket.decoded = decoded;
    //       next();
    //     });
    //   }
    //   else {
    //     next(new Error('Authentication error'));
    //   }    
    // })
    // .on('connection', function(socket) {
    //     // Connection now authenticated to receive further events

    //     socket.on('message', function(message) {
    //         io.emit('message', message);
    //     });
    // });

    // SOCKET AUTH MIDDLEWARE END

    io.on('connection', async (socket) => {
        // console.log('socket.handshake', socket.handshake.query);
        console.log('A socket client connected', socket.id);
        io.emit('socket-connected', socket.id);

        const userID = socket.handshake.query.userId || '';
        update_user_connections(userID, socket.id, null);

        socket.on('peer-user', data => {
            // console.log('__DATA__', data);
            const { userId, socketId, peerId } = data;
            update_user_connections(userId, socketId, peerId);
        })
        socket.on('send_message', (data) => {
            console.log("received message from client side", data)
            // console.log('messages', messages);
            io.emit('received_message', data)
        })

        socket.on('call_config', (data) => {
            console.log("received call_config from client side", data)
            // console.log('messages', messages);
            io.emit('call_config', data)
        })

        socket.on('call_disconnected', (data) => {
            console.log("received call_disconnected from client side", data)
            // console.log('messages', messages);
            io.emit('call_disconnected', data)
        })

        socket.on('disconnect', () => {
            console.log('A socket user disconnected');
        });

    });
}
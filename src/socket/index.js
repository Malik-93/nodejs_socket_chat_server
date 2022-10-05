const { Server } = require("socket.io");
const { update_user_connections } = require("../utils");
let callers = [];
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
        socket.emit('socket-connected', socket.id);

        const userID = socket.handshake.query.userId || '';
        update_user_connections(userID, socket.id, null);

        socket.on('peer-user', async data => {
            // console.log('__DATA__', data);
            const { userId, socketId, peerId } = data;
            await update_user_connections(userId, socketId, peerId);
            socket.emit("peer_id_saved", null)
        })
        socket.on('send_message', (data) => {
            console.log("received message from client side", data)
            // console.log('messages', messages);
            io.emit('received_message', data)
        })

        socket.on('call_config', (data) => {
            console.log("received call_config from client side", data)
            io.emit('call_config', data)
        })

        // Callers info
        socket.on('sender_caller', (data) => {
            // console.log("received sender_caller from client side", data)
            data = { callerSocketID: data.caller.socketID, recieverSocketID: data.receiver.socketID };
            callers.push(data);
        })

        // Declined
        socket.on('call_declined', (data) => {
            // console.log("received call_config from client side", data)
            const { socketId } = data;
            const callerObj = callers.find(x => x.recieverSocketID == socketId);
            socket.to(callerObj.callerSocketID).emit("call_declined", "Call declined by the user");
            callers = callers.filter(x => x.recieverSocketID !== socketId);
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
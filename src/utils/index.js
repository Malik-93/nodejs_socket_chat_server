const { networkInterfaces } = require('os');
const mongoose = require('mongoose');
const { find_user, update_existing_user } = require('../user/user.modules');
const get_network_ip = () => {
    const nets = networkInterfaces();
    let networkIP = ''
    for (const name of Object.keys(nets)) {
        // @ts-ignore
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            if (net.family === familyV4Value && !net.internal) {
                networkIP = net.address
            }
        }
    }
    return `${networkIP}`
}
const update_user_connections = async (userID = '', socketID = '', peerID = '') => {
    console.log('userID', userID);
    if (mongoose.Types.ObjectId.isValid(userID)) {
        const results = await find_user({ body: { user_id: userID } });
        // console.log('results', results);
        try {
            if (results.user) await update_existing_user({ body: { user: results.user, socketID, peerID } })
            else console.log('[socket.connection] user not found...');
        } catch (error) {
            console.log('error...', error);
        }
    } else console.log(`[update_user_connections] User id is missing...`)
}
module.exports = {
    get_network_ip,
    update_user_connections
}
const models = require('../models');

class user_module {

    static save_user_details = async (req) => {
        try {
            console.log("[save_user_details].req body", req.body)
            const { profileImage } = req.body
            let set_data = req.body
            if (!!profileImage) {
                set_data.profileImage = profileImage
            }
            return await models.users.create(set_data)

        } catch (error) {
            throw error
        }
    }

    static reterive_user = async (req) => {
        try {
            console.log("[reterive_user].req body", req.query)

            let { limit, pagination } = req.query

            let query = {}
            let projection = { __v: 0 }
            let options = {
                lean: true,
                sort: { _id: -1 },
                skip: !Number(pagination) ? 0 : Number(pagination) * !Number(limit) ? 10 : Number(limit),
                limit: !Number(limit) ? 10 : Number(limit)
            }
            let users = await models.users.find(query, projection, options)
            let count = await models.users.count(query)
            return { users, count }
        } catch (error) {
            throw error
        }
    }

    static verify_user = async (req) => {
        try {
            console.log("[verify_user].req body", req.body)
            const { otp, user_id } = req.body
            if (otp == '123456') {
                let user = await models.users.findById(user_id)
                return { user: user, status: true, message: 'success' }
            } else {
                return { user: null, status: false, message: 'Otp Invalid' }
            }

        } catch (error) {
            throw error
        }
    }

    static find_user = async (req) => {
        try {
            // console.log("[find_user].req body", req.body)
            const { user_id } = req.body;
            let user = await models.users.findById(user_id)
            if (user) return { user, status: true, message: 'success' };
            else return { user: null, status: false, message: 'User not found' }
        } catch (error) {
            throw error
        }
    }
    static update_existing_user = async (req) => {
        try {
            // console.log("[update_existing_user].req body", req.body)
            const { user, socketID, peerID } = req.body;
            const filter = { _id: user._id };
            let update = {};
            if (socketID) update.socketID = socketID;
            if (peerID) update.peerID = peerID;
            const dbProcess = models.users.findOneAndUpdate(filter, update, { new: true }, (err, doc, res) => {
                if (err) throw err;
                else return { user: doc, status: true, message: 'User updated' }
            })
            await dbProcess.clone();
        } catch (error) {
            throw error
        }
    }

}

module.exports = user_module
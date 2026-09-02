const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../model/ConnectionRequest');
const User = require('../model/user')

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const { status, toUserId } = req.params;
        const fromUserId = req.user._id;

        const allowedStatuses = ['interested', 'ignored'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid connection request status." });
        }

        const recipientUser = await User.findById(toUserId);

        if (!recipientUser) {
            return res.status(400).json({ message: "The user you are trying to connect with does not exist." });
        }

        if (fromUserId.toString() === toUserId.toString()) {
            return res.json({ message: "You cannot send a connection request to yourself." });
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { toUserId, fromUserId },
                { toUserId: fromUserId, fromUserId: toUserId }
            ]
        });

        if (existingConnectionRequest) {
            return res.json({ message: 'A connection request already exists between these users.' });
        }

        const connectionRequest = new ConnectionRequest({
            toUserId, fromUserId, status
        });

        await connectionRequest.save();

        const message = {
            interested: `${req.user.firstName} sent a connection request to ${recipientUser.firstName} successfully.`,
            ignored: `${req.user.firstName} ignored ${recipientUser.firstName}'s connection request.`
        };
        
        res.send(message[status]);
    } catch (err) {
        res.status(400).send('ERROR : ' + err);
    }
})

module.exports = requestRouter;
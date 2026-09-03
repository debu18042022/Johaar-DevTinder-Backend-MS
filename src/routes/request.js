const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../model/connectionRequest');
const User = require('../model/user')
const mongoose = require('mongoose');

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const { status, toUserId } = req.params;
        const fromUserId = req.user._id;

        const allowedStatuses = ['interested', 'ignored'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid connection request status." });
        }

        // Is toUserId a valid MongoDB ObjectId? because it can possible if someone sent 'hello123'
        if (!mongoose.isValidObjectId(toUserId)) return res.status(400).json({ message: "Invalid user ID" })

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
            interested: `${req.user.firstName} interested in ${recipientUser.firstName}.`,
            ignored: `${req.user.firstName} ignored ${recipientUser.firstName}`
        };

        res.send(message[status]);
    } catch (err) {
        res.status(400).send('ERROR : ' + err);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const { status, requestId } = req.params;
        const loggedInUser = req.user;

        const allowedStatuses = ['accepted', 'rejected'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid connection status.' })
        }

        // Is requestId a valid MongoDB ObjectId? because it can possible if someone sent 'hello123'
        if (!mongoose.isValidObjectId(requestId)) return res.status(400).json({ message: "Invalid Connection request ID." })

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested',
        })

        if (!connectionRequest) {
            return res.status(400).json({ message: 'connectionRequest not found' });
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.status(200).json({ message: `${status} your invite`, data });
    } catch (err) {
        res.status(400).send('ERROR : ' + err.message);
    }
})

module.exports = requestRouter;
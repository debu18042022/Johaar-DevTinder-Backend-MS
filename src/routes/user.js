const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user");

const USER_SAFE_DATA = ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"]
// get all the pending connection request 
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate("fromUserId", USER_SAFE_DATA)

        res.json({
            message: 'Requested connections successfully',
            data: connectionRequest
        })
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [{ toUserId: loggedInUser._id, status: "accepted" },
            { fromUserId: loggedInUser._id, status: "accepted" }],
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });


        res.json({ message: "successful", data })
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = req.query.page || 1;
        let limit = req.query.limit || 10;

        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select('fromUserId toUserId')

        const hideConnectionRequest = new Set();

        connectionRequest.forEach((ele) => {
            hideConnectionRequest.add(ele.fromUserId.toString());
            hideConnectionRequest.add(ele.toUserId.toString());
        })

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideConnectionRequest) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({ message: 'success', length: users.length, data: users })

    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
})


module.exports = userRouter;
const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    console.log('connection request sending!!!');
    res.send(user.firstName + ' sent a new connection request!');
})

module.exports = requestRouter;
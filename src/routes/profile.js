const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require("../utils/validation");
const User = require('../model/user');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('node:crypto');

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.send(user);
    } catch (err) {
        res.status(400).send("ERR : " + err);
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error('Invalid Edit Request');
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName} your profile has been updated successfully.`,
            data: loggedInUser
        });
    } catch (err) {
        res.send("ERROR : " + err.message);
    }
})

profileRouter.post("/profile/edit/forgot-password", async (req, res) => {
    try {
        const { emailId } = req.body;
        const user = await User.findOne({ emailId });

        if (!user) {
            throw new Error('not found');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 1000 * 60 * 15)

        user.forgotPasswordToken = token;
        user.forgotPasswordTokenExpiry = tokenExpiry;
        await user.save();
        res.json({
            token: token,
        })

    } catch (err) {
        res.send("ERROR : " + err.message);
    }
})

profileRouter.post('/profile/edit/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({ forgotPasswordToken: token });

        if (!user) {
            throw new Error('not valid user');
        }

        if (new Date() > user?.forgotPasswordTokenExpiry) {
            throw new Error('Token expired!');
        }

        if (!validator.isStrongPassword(newPassword)) {
            throw new Error('Please enter valid password');
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);

        user.password = passwordHash;
        user.forgotPasswordToken = null;
        user.forgotPasswordTokenExpiry = null;
        await user.save();
        res.json({
            message: "your password is successfully reset, please login!"
        })
    } catch (err) {
        res.status(400).send('ERROR : ' + err.message);
    }
})

module.exports = profileRouter;
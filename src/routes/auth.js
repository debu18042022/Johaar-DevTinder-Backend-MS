const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../model/user');

authRouter.post('/signup', async (req, res) => {
    try {
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        // creating a new instance of the User model.
        const user = new User({ firstName, lastName, emailId, password: passwordHash });
        // by this line our user data will save in the database inside the User collection and this save() method returns a Promise so we need to apply async and await
        await user.save();
        res.send('User added successfully!');

    } catch (err) {
        res.status(400).send('Error : ' + err.message);
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            throw new Error('Invalid Credential');
        }

        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {
            throw new Error('Invalid Credential');
        }

        const token = await user.getJWT();

        if (!token) {
            throw new Error('User not exist');
        }

        res.cookie('token', token, {
            // maxAge: 60 * 1000 // 1 minute in ms
            expires: new Date(Date.now() + 1 * 60 * 60 * 1000) // 60 * 1000 → 1 minute, 60 * 60 * 1000 → 1 hour, 1 * → still 1 hour 
        });
        res.send('login successful!');

    } catch (err) {
        res.status(400).send('ERROR : ' + err.message);
    };
})

authRouter.post("/logout", (req, res) => {
    res.clearCookie('token');
    res.send('LoggedOut successful');
})

module.exports = authRouter;

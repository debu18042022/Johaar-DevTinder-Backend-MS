const express = require("express");
const connectDB = require("./config/database");
const mongoose = require('mongoose');
const User = require("./model/user");
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

const app = express();

app.use(express.json());
app.use(cookieParser());

// signup api
app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    // creating a new instance of the User model.
    const user = new User({ firstName, lastName, emailId, password: passwordHash });
    await user.save(); // by this line our user data will save in the database inside the User collection
    // this save() method returns a Promise so we need to apply async and await
    res.send("user Added Successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + " " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error('Invalid Credentials');
    }
    else {
      const token = user.getJWT();

      //Add the token to cookie and send the response back to the users
      res.cookie('token', token, {
        // maxAge: 60 * 1000 // 1 minute in ms
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000) // 60 * 1000 → 1 minute, 60 * 60 * 1000 → 1 hour, 1 * → still 1 hour 
      });
      res.send('login successfull!!!');
    }
  } catch (err) { res.status(400).send("ERR : " + err.message) };
})

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERR : " + err);
  }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  console.log('connection request sending!!!');
  res.send('A new Connection request sent!');
})

app.use("/", (err, req, res, next) => { // wild card error handling
  if (err) {
    res.status(500).send("Something went wrong, connect with technical Team:" + " " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("database connection establised...");
    app.listen(7777, () => {
      console.log("Server is successfully running on port 7777");
    });
  })
  .catch((err) => {
    console.error("cannot connect to database!!", err);
  });
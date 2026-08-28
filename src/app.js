const express = require("express");
const connectDB = require("./config/database");
const mongoose = require('mongoose');
const User = require("./model/user");

const app = express();

app.use(express.json());

// signup api
app.post("/signup", async (req, res) => {
  // creating a new instance of the User model.
  const user = new User(req.body);

  try {
    await user.save(); // by this line our user data will save in the database inside the User collection
    // this save() method returns a Promise so we need to apply async and await
    res.send("user Added Successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + " " + err.message);
  }
});

// get partiular user
app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(400).send("user not found!");
    }
    else {
      res.send(user);
    }
  } catch (err) {
    if (err) {
      res.status(500).send("something went wrong" + "" + err);
    }
  }
})

// get all the user
app.get("/feed", async (req, res) => {
  try {
    const { lastName, age } = req.body;

    const users = await User.find({ lastName: lastName, age: age });
    if (users.length === 0) {
      res.status(400).send("users not found");
    }
    else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send("Something went wrong" + " " + err);
  }
})

// delete the user
app.delete("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.isValidObjectId(userId)) {
      return res.send(400).send("Invalide user ID");
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(400).send('user not found');
    }

    res.send("User deleted successfully");

  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
})

// update the user
app.patch("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send("Invalid user ID");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      req.body,
      {
        returnDocument: "after",
      }
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send("User updated successfully");

  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

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
const express = require("express");
const connectDB = require("./config/database");
const User = require("./model/user");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new UUser({ // creating a new instance of the User model.
    firstName: "Anand",
    lastName: "Singh",
    emailId: "anandsingh@gmail.com",
    password: "12342343",
    age: 27,
    gender: "male",
  });

  try {
    await user.save(); // by this line our user data will save in the database inside the User collection
    // this save() method returns a Promise so we need to apply async and await
    res.status(200).send("user Added Successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + " " + err.message);
  }
});

app.use("/", (err, req, res, next) => { // wild card error handling
  if (err) {
    res.status(500).send("Something went wrong:" + " " + err.message);
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
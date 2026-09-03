const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middlewares/auth');

const app = express();

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


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
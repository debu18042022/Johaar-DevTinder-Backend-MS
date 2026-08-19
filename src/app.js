const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.get("/getUserData", (req, res) => {
  // try {
    // logic of getting DB data and give response.
    throw new Error("ajsdbjasbdjkas");
    res.send("sent user data");
  // } catch (err) {
  //   res.status(500).send("some error occured please contact technical team");
  // }
});

app.use("/", (err, req, res, next) => { //  wild card error handling
  if(err){
    res.status(500).send("something went wrong");
  }
});

app.listen(7777, () => {
  console.log("Server is successfully running on port 7777");
});

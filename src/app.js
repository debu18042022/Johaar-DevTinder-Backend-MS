const express = require("express");

const app = express();

app.use("/home", (req, res) => {
  res.send("home endpoint");
});

app.use("/test", (req, res) => {
  res.send("test endpoints");
});

app.listen(7777, () => {
  console.log("Server is successfully running on port 7777");
});

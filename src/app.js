const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", adminAuth);

app.get("/admin/getData", (req, res) => {
  res.send("GET ALL DATA");
});

app.get("/user/getData", userAuth, (req, res) => {
  res.send("GET USER DATA");
});

app.delete("/admin/delete", (req, res) => {
  res.send("DELETED ALL DATA");
});

app.listen(7777, () => {
  console.log("Server is successfully running on port 7777");
});

const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ name: "John", age: 20 });
});

app.post("/user", (req, res) => {
  res.send("Saved data successfully to DB");
});

app.delete("/user", (req, res) => {
  res.send("Deleted data successfully from DB");
});

app.use("/", (req, res) => {
  res.send("root endpoint");
});

app.listen(7777, () => {
  console.log("Server is successfully running on port 7777");
});

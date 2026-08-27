const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sujeetsahu:SujeetSahu%409125@cluster0.zvnxfp5.mongodb.net/devTinder",
  );
};

module.exports = connectDB;

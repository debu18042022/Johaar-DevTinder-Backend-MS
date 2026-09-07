const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    // No token → user is not logged in
    if (!token) {
      return res.status(401).send("Please log in to continue.");
    }

    // Verify JWT
    const decodeData = jwt.verify(token, "DEV@Tinder$790");

    const userId = decodeData?._id;

    if (!userId) {
      return res.status(401).send("Invalid authentication token.");
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Attach logged-in user to request
    req.user = user;

    // Continue to the actual route
    return next();

  } catch (err) {
    return res.status(401).send("Invalid or expired token.");
  }
};

module.exports = { userAuth };

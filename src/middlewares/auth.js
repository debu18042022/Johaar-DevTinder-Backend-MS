const jwt = require('jsonwebtoken');
const User = require("../model/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error('invalid token!!!');
    }

    const decodeData = jwt.verify(token, 'DEV@Tinder$790');
    const _id = decodeData?._id;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error('invalid user!!!');
    }

    req.user = user;
    next();
  }
  catch (err) {
    res.status(400).send('ERROR : ' + err.message);
  }
}

module.exports = { userAuth };

const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthenticated = token === "xyz";
  console.log("Authorization run for admin");
  if (!isAuthenticated) {
    return res.status(401).send("Unauthenticated");
  }

  next();
};

const userAuth = (req, res, next) => {
  const token = "abc";
  const isAuthenticated = token === "abc";
  console.log("Authorization Run for User");
  if (!isAuthenticated) {
    return res.status(401).send("Unauthenticated");
  }

  next();
};

module.exports = { adminAuth, userAuth };

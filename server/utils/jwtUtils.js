const jwt = require("jsonwebtoken");
const verifyToken = (token) => {
  if (!token) {
    return null;
  }
  return jwt.verify(token, process.env.TOKEN);
};

module.exports = { verifyToken };

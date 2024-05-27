// @ts-nocheck
const jwt = require("jsonwebtoken");
const verifyToken = (token) => {
  console.log(jwt);
  console.log(token, process.env.TOKEN);
  if (!token) {
    return null;
  }
  return jwt.verify(token, process.env.TOKEN);
};

module.exports = { verifyToken };

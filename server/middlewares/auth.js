const jwt = require("jsonwebtoken");

// Middleware for authorization
const auth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Middleware for authorization with a different structure
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ msg: "Authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = {
  auth,
  authMiddleware,
};

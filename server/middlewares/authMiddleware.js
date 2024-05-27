import jwt from "jsonwebtoken";

const authVerifyToken = (req, res, next) => {
  const token = req.headers["Authorization"]?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ msg: "Authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = {
  authVerifyToken,
};

const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken) {
    return res
      .status(402)
      .json({ success: false, message: "Access Token not found" });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.Accestoken);
    req.UserExit = decoded.UserExit;
    const userRole = req.UserExit.roles;
    if (userRole === process.env.USER) {
      return res
        .status(403)
        .json({ success: false, message: "Insufficient privileges" });
    }
    next();
  } catch (Err) {
    console.log(Err);
    return res
      .status(403)
      .json({ success: false, message: "Invalid access token" });
  }
};

module.exports = verifyToken;

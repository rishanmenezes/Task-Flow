const jwt = require("jsonwebtoken");

/**
 * Auth middleware — verifies the JWT from the Authorization header
 * and attaches the decoded user payload to `req.user`.
 *
 * Expected header format:  Authorization: Bearer <token>
 */
const auth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, email, iat, exp }
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token has expired. Please login again." });
    }
    return res
      .status(401)
      .json({ success: false, message: "Invalid token." });
  }
};

module.exports = auth;

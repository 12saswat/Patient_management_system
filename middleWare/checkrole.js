const jwt = require("jsonwebtoken");

// Middleware to check the role from JWT token
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied: No Token Provided!" });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECREATE_KEY);
      const userRole = decoded.role;

      if (userRole !== requiredRole) {
        return res
          .status(403)
          .json({ message: "Doctor are not Register a patient " });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(400).json({ message: "Invalid Token" });
    }
  };
};

module.exports = { checkRole };

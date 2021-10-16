const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // If no cookie, user is not authenticated
  if (!token) {
    return res.status(401).send({
      message: "Unauthenticated. No token.",
    });
  }

  // Decode token
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    // If token is invalid
    if (error) {
      return res.status(401).send({
        message: "Unauthenticated. Invalid token.",
      });
    }

    // Save decoded token for later use
    res.locals.decodedToken = decoded;

    // Continue middleware stack
    next();
  });
};

module.exports = { requireAuth };

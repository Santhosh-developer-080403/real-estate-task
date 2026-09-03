const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    // Intha line irukkaa nu parthu kola:
    req.user = decoded; // or req.user = decoded.user (ungakarathu token structure-ku etha maathiri)

    next();
  });
};

module.exports = verifyToken;

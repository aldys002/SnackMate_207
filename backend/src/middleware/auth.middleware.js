const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ada" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "snackmate_secret");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid" });
  }
};

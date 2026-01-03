const db = require("../config/db");

module.exports = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ message: "API Key tidak ada" });
  }

  const query = `
    SELECT * FROM api_keys
    WHERE api_key = ?
    AND status = 'active'
    AND expired_at > NOW()
  `;

  db.query(query, [apiKey], (error, result) => {
    if (result.length === 0) {
      return res.status(401).json({ message: "API Key tidak valid" });
    }

    next();
  });
};

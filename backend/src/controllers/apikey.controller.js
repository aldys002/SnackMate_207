const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

exports.generateApiKey = (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Hanya user" });
  }

  const apiKey = uuidv4();
  const expiredAt = new Date();
  expiredAt.setMonth(expiredAt.getMonth() + 1);

  const query =
    "INSERT INTO api_keys (user_id, api_key, expired_at) VALUES (?, ?, ?)";

  db.query(
    query,
    [req.user.id, apiKey, expiredAt],
    () => {
      res.json({
        message: "API Key berhasil dibuat",
        api_key: apiKey,
        expired_at: expiredAt,
      });
    }
  );
};

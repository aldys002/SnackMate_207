const db = require("../config/db");

exports.getUsers = (req, res) => {
  db.query("SELECT id, name, email, role FROM users", (e, r) =>
    res.json(r)
  );
};

exports.getApiKeys = (req, res) => {
  db.query("SELECT * FROM api_keys", (e, r) => res.json(r));
};

exports.createSnack = (req, res) => {
  const { name, description, price, image_url } = req.body;

  db.query(
    "INSERT INTO snacks (name, description, price, image_url) VALUES (?,?,?,?)",
    [name, description, price, image_url],
    () => res.json({ message: "Snack ditambahkan" })
  );
};

const db = require("../config/db");

// Ambil semua user
exports.getUsers = (req, res) => {
  db.query(
    "SELECT id, name, email, role FROM users",
    (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal load user" });
      res.json(result);
    }
  );
};

// Ambil semua API keys
exports.getApiKeys = (req, res) => {
  db.query(
    "SELECT * FROM api_keys",
    (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal load API keys" });
      res.json(result);
    }
  );
};

// Tambah snack (opsional jika ingin pakai adminController)
exports.createSnack = (req, res) => {
  const { name, description, price, image_url } = req.body;
  db.query(
    "INSERT INTO snacks (name, description, price, image_url) VALUES (?,?,?,?)",
    [name, description, price, image_url],
    (err) => {
      if (err) return res.status(500).json({ message: "Gagal tambah snack" });
      res.json({ message: "Snack berhasil ditambahkan" });
    }
  );
};

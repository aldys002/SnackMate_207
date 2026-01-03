const db = require("../config/db");

// GET all snacks
exports.getAllSnacks = (req, res) => {
  const query = "SELECT * FROM snacks ORDER BY id DESC";
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal load snack" });
    res.json(result);
  });
};

// GET snack by ID
exports.getSnackById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM snacks WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal load snack" });
    if (result.length === 0) return res.status(404).json({ message: "Snack tidak ditemukan" });
    res.json(result[0]);
  });
};

// ADD snack
exports.addSnack = (req, res) => {
  const { name, brand, country, description, price, stock, image_url } = req.body;
  if (!name || !description || !price || !image_url) {
    return res.status(400).json({ message: "Lengkapi semua field wajib" });
  }
  const query = `
    INSERT INTO snacks (name, brand, country, description, price, stock, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [name, brand, country, description, price, stock || 0, image_url], (err) => {
    if (err) return res.status(500).json({ message: "Gagal tambah snack" });
    res.json({ message: "Snack berhasil ditambahkan" });
  });
};

// UPDATE snack
exports.updateSnack = (req, res) => {
  const { id } = req.params;
  const { name, brand, country, description, price, stock, image_url } = req.body;
  const query = `
    UPDATE snacks SET name=?, brand=?, country=?, description=?, price=?, stock=?, image_url=?
    WHERE id=?
  `;
  db.query(query, [name, brand, country, description, price, stock, image_url, id], (err) => {
    if (err) return res.status(500).json({ message: "Gagal update snack" });
    res.json({ message: "Snack berhasil diupdate" });
  });
};

// DELETE snack
exports.deleteSnack = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM snacks WHERE id=?";
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ message: "Gagal hapus snack" });
    res.json({ message: "Snack berhasil dihapus" });
  });
};

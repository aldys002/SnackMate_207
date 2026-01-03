const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const userRole = role === "admin" ? "admin" : "user";

  const query =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(
    query,
    [name, email, hashedPassword, userRole],
    (error) => {
      if (error) {
        return res.status(400).json({ message: "Email sudah terdaftar" });
      }

      res.json({ message: "Register berhasil" });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], (error, result) => {
    if (result.length === 0) {
      return res.status(401).json({ message: "Login gagal" });
    }

    const user = result[0];
    const isValidPassword = bcrypt.compareSync(
      password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "snackmate_secret",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      role: user.role,
    });
  });
};

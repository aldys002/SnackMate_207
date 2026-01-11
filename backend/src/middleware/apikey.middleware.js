const db = require("../config/db");

module.exports = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ message: "API Key tidak ditemukan di header" });
  }

  const query = `
    SELECT * FROM api_keys 
    WHERE api_key = ? 
    AND status = 'active'
  `;
  // Catatan: Bagian 'AND expired_at > NOW()' saya hapus jika kamu tidak pakai kolom expired di database.

  db.query(query, [apiKey], (error, result) => {
    if (error || result.length === 0) {
      return res.status(401).json({ message: "API Key tidak valid" });
    }

    const keyData = result[0];

    // --- BAGIAN LIMIT HABIS ---
    if (keyData.usage_limit <= 0) {
      return res.status(429).json({ 
        // Ubah pesan agar user tidak bingung mencoba generate ulang sendiri
        message: "Limit token habis (0). Akses ditutup. Silakan hubungi admin@snackmate.com" 
      });
    }

    // Kurangi limit 1 di database setiap kali ada request produk yang berhasil
    const updateQuery = "UPDATE api_keys SET usage_limit = usage_limit - 1 WHERE api_key = ?";
    db.query(updateQuery, [apiKey], (updErr) => {
        if (updErr) return res.status(500).json({ message: "Gagal update limit" });
        next();
    });
  });
};
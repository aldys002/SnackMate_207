const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.generateApiKey = (req, res) => {
    // 1. Ambil ID dari req.user (hasil dari auth.middleware)
    const userId = req.user ? req.user.id : null;

    // Proteksi: Jika ID tidak ada, jangan lanjut ke query
    if (!userId) {
        return res.status(401).json({ 
            message: "Sesi tidak valid. Silakan login ulang (Logout lalu Login lagi)." 
        });
    }

    const newApiKey = uuidv4();
    const initialLimit = 50;
    
    // 2. Buat tanggal expired (1 tahun ke depan)
    const expiredAt = new Date();
    expiredAt.setFullYear(expiredAt.getFullYear() + 1);
    const formattedExpiredAt = expiredAt.toISOString().slice(0, 19).replace('T', ' ');

    // 3. Cek apakah user sudah punya key
    const checkQuery = "SELECT id FROM api_keys WHERE user_id = ?";
    
    db.query(checkQuery, [userId], (err, results) => {
        if (err) {
            console.error("DB Error Check:", err);
            return res.status(500).json({ message: "Database error saat pengecekan" });
        }

        // Jika ditemukan data, berarti memang sudah pernah buat
        if (results.length > 0) {
            return res.status(403).json({ 
                message: "Akses ditolak: Anda sudah memiliki API Key sebelumnya." 
            });
        }

        // 4. Jika benar-benar kosong, lakukan INSERT
        const insertQuery = `
            INSERT INTO api_keys (user_id, api_key, usage_limit, expired_at, status) 
            VALUES (?, ?, ?, ?, 'active')
        `;
        
        db.query(insertQuery, [userId, newApiKey, initialLimit, formattedExpiredAt], (insErr) => {
            if (insErr) {
                console.error("DB Error Insert:", insErr);
                return res.status(500).json({ 
                    message: "Gagal menyimpan API Key ke database",
                    error: insErr.sqlMessage 
                });
            }
            
            // Berhasil! Kirim data ke frontend
            res.json({ 
                api_key: newApiKey, 
                usage_limit: initialLimit,
                message: "API Key berhasil dibuat!" 
            });
        });
    });
};

// Fungsi status juga pastikan aman
exports.getKeyStatus = (req, res) => {
    const userId = req.user.id;
    // Menghitung expired 30 hari sesuai dokumen arsitektur 
    const query = `
        SELECT api_key, usage_limit, created_at, 
        DATE_ADD(created_at, INTERVAL 30 DAY) as expired_at 
        FROM api_keys WHERE user_id = ?
    `;

    db.query(query, [userId], (err, result) => {
        if (err) return res.status(500).json({ message: "Gagal ambil status" });
        if (result.length === 0) return res.status(404).json({ message: "API Key tidak ditemukan" });

        const data = result[0];
        const isExpired = new Date() > new Date(data.expired_at);

        res.json({
            api_key: data.api_key,
            usage_limit: data.usage_limit,
            created_at: data.created_at,
            expired_at: data.expired_at,
            status: isExpired ? "Expired" : "Active"
        });
    });
};
const express = require("express");
const cors = require("cors");
const path = require("path"); // biar path static lebih aman
const app = express();

app.use(cors());
app.use(express.json());

// Static folder untuk gambar
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// Routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/admin", require("./routes/admin.routes"));

// Tambah route API Key
app.use("/apikey", require("./routes/apikey.routes"));

// Tambah route snack (misal nanti ada endpoint /api/snacks)
app.use("/api/snacks", require("./routes/snack.routes"));

module.exports = app;

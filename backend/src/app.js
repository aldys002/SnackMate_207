const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

app.use(
  "/images",
  express.static(path.join(__dirname, "../public/images"))
);

app.use("/auth", require("./routes/auth.routes"));
app.use("/apikey", require("./routes/apikey.routes"));
app.use("/api/snacks", require("./routes/snack.routes"));
app.use("/admin", require("./routes/admin.routes"));

module.exports = app;

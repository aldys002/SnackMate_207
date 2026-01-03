const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Cokiber_2893",
  database: "snackmate_db",
  port: 3307,
});

module.exports = db;

const db = require("../config/db");

exports.getAllSnacks = (req, res) => {
  const query = "SELECT * FROM snacks";

  db.query(query, (error, result) => {
    res.json(result);
  });
};

exports.getSnackDetail = (req, res) => {
  const query = "SELECT * FROM snacks WHERE id = ?";

  db.query(query, [req.params.id], (error, result) => {
    res.json(result[0]);
  });
};

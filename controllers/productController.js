const db = require('../config/db');

exports.getProducts = (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  db.query(
    "SELECT * FROM products WHERE status = 'active' LIMIT ? OFFSET ?",
    [parseInt(limit), parseInt(offset)],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

exports.getAllProducts = (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  db.query(
    "SELECT * FROM products LIMIT ? OFFSET ?",
    [parseInt(limit), parseInt(offset)],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

exports.searchProducts = (req, res) => {
  const { name, category } = req.query;
  let query = "SELECT * FROM products WHERE status = 'active'";
  let params = [];
  if (name) {
    query += " AND name LIKE ?";
    params.push(`%${name}%`);
  }
  if (category) {
    query += " AND category_id = ?";
    params.push(category);
  }
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};


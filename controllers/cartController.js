const db = require('../config/db');

exports.addToCart = (req, res) => {
  const user_id = req.user.id;
  const { product_id, quantity } = req.body;
  db.query(
    "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
    [user_id, product_id, quantity || 1],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true, cart_id: result.insertId });
    }
  );
};

exports.getCart = (req, res) => {
  const user_id = req.user.id;
  db.query(
    "SELECT cart.*, products.name, products.price FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = ?",
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

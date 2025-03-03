const db = require('../config/db');

exports.checkout = (req, res) => {
  const user_id = req.user.id;

  const orderQuery = `
    INSERT INTO orders (user_id, total_price, status)
    SELECT user_id, SUM(products.price * cart.quantity), 'completed'
    FROM cart JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;
  db.query(orderQuery, [user_id], (err, orderResult) => {
    if (err) return res.status(500).json(err);
    const order_id = orderResult.insertId;
    
    db.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price)
       SELECT ?, product_id, quantity, products.price
       FROM cart JOIN products ON cart.product_id = products.id
       WHERE cart.user_id = ?`,
      [order_id, user_id],
      (err, orderItemsResult) => {
        if (err) return res.status(500).json(err);
        db.query("DELETE FROM cart WHERE user_id = ?", [user_id], (err, deleteResult) => {
          if (err) return res.status(500).json(err);
          res.json({ success: true, order_id });
        });
      }
    );
  });
};

exports.orderHistory = (req, res) => {
  const user_id = req.user.id;
  db.query("SELECT * FROM orders WHERE user_id = ?", [user_id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

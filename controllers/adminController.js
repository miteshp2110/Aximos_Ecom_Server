const db = require('../config/db');

exports.updateProduct = (req, res) => {
  console.log(req.body)
  const { id } = req.params;
  const { name, description, price, status, category_id, image_urls } = req.body;
  const query = `
    UPDATE products 
    SET name = ?, description = ?, price = ?, status = ?, category_id = ?, image_urls = ?
    WHERE id = ?
  `;
  db.query(
    query,
    [name, description, price, status, category_id, JSON.stringify(image_urls), id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true, affectedRows: result.affectedRows });
    }
  );
};

exports.addProduct = (req, res) => {
  console.log(req.body);
  const { name, description, price, status, category_id, image_urls } = req.body;
  const query = `
    INSERT INTO products (name, description, price, status, category_id, image_urls)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [name, description, price, status, category_id, JSON.stringify(image_urls)],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true, product_id: result.insertId });
    }
  );
};

exports.getStats = (req, res) => {
  
  const revenueQuery = "SELECT SUM(total_price) AS total_revenue FROM orders WHERE status = 'completed'";
  const itemsQuery = "SELECT SUM(quantity) AS total_items_sold FROM order_items";
  const customersQuery = "SELECT COUNT(DISTINCT user_id) AS total_active_customers FROM orders WHERE status = 'completed'";

  db.query(revenueQuery, (err, revenueResult) => {
    if (err) return res.status(500).json(err);
    db.query(itemsQuery, (err, itemsResult) => {
      if (err) return res.status(500).json(err);
      db.query(customersQuery, (err, customersResult) => {
        if (err) return res.status(500).json(err);
        const totalRevenue = revenueResult[0].total_revenue || 0;
        const totalItemsSold = itemsResult[0].total_items_sold || 0;
        const totalActiveCustomers = customersResult[0].total_active_customers || 0;
        
        const conversionRate = totalItemsSold ? ((totalActiveCustomers / totalItemsSold) * 100).toFixed(2) : 0;
        res.json({
          total_revenue: totalRevenue,
          total_items_sold: totalItemsSold,
          total_active_customers: totalActiveCustomers,
          conversion_rate: conversionRate,
        });
      });
    });
  });
};

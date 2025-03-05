const db = require('../config/db');



exports.updateProduct = (req, res) => {
  console.log(req.body)
  const { id } = req.params;
  const { name, description, price, status, category_id, existing_image_urls } = req.body;
  let new_img_array=[]

  new_img_array = JSON.parse(existing_image_urls)
  console.log(new_img_array)

  if(req.files && req.files.length>0){
    req.files.map(file=>{
      new_img_array.push(`${req.protocol}://${req.get('host')}/uploads/${file.filename}`)
    })
  }
  console.log("new_img_arr: ",new_img_array)
  const query = `
    UPDATE products 
    SET name = ?, description = ?, price = ?, status = ?, category_id = ?, image_urls = ?
    WHERE id = ?
  `;
  db.query(
    query,
    [name, description, price, status, category_id, JSON.stringify(new_img_array), id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true, affectedRows: result.affectedRows });
    }
  );
};

exports.addProduct = (req, res) => {
  const { name, description, price, status, category_id } = req.body;

 
  const imageUrls = req.files.map(file => {

    return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
  });

  const query = `
    INSERT INTO products (name, description, price, status, category_id, image_urls)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [name, description, price, status, category_id, JSON.stringify(imageUrls)], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ success: true, product_id: result.insertId });
  });
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

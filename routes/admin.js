const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');


router.put('/product/:id', verifyToken, requireAdmin, adminController.updateProduct);


router.post('/product', verifyToken, requireAdmin, adminController.addProduct);


router.get('/stats', verifyToken, requireAdmin, adminController.getStats);

module.exports = router;

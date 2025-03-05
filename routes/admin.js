const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuthController = require('../controllers/adminAuthController')
const adminCategoryController = require('../controllers/adminCategoryController');
const productController = require('../controllers/productController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');


router.put('/product/:id', verifyToken, requireAdmin, adminController.updateProduct);


router.post('/product', verifyToken, requireAdmin, adminController.addProduct);

router.post('/register', verifyToken, requireAdmin, adminAuthController.registerAdmin);

router.post('/category', verifyToken, requireAdmin, adminCategoryController.addCategory);

router.get('/stats', verifyToken, requireAdmin, adminController.getStats);

router.get('/products', verifyToken, requireAdmin, productController.getAllProducts);

module.exports = router;

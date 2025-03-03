const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware');


router.post('/', verifyToken, cartController.addToCart);


router.get('/', verifyToken, cartController.getCart);

module.exports = router;

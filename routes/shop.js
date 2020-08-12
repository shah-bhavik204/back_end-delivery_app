const path = require('path');
const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const expressValidator = require('../middleware/express-validator');

// router.get('/', shopController.getIndex);
 
router.get('/products', shopController.getProducts);

router.post('/add-product',checkAuth, expressValidator.validate('addProduct'), shopController.saveProduct);

router.post('/add-products',checkAuth, expressValidator.validate('addProducts'), shopController.addMultpleProducts);

router.post('/edit-product',checkAuth, shopController.postEditProduct) ;

// router.get('/products/:productId', shopController.getProduct);

// router.get('/cart', shopController.getCart);

router.post('/cart', checkAuth, shopController.postCart);

// router.post('/cart-delete-item', shopController.postCartDeleteProduct);

// router.post('/create-order', shopController.postOrder);

// router.get('/orders', shopController.getOrders);

module.exports = router;

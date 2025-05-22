const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
    getAllPurchases,
    createPurchase,
    getPurchasesByUser,
    getPurchasesByProduct,
} = require('../controllers/purchases.controller');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', authMiddleware, getAllPurchases);
router.post('/', authMiddleware, createPurchase);
router.get(
    '/user/:userId',
    authMiddleware,
    adminMiddleware,
    getPurchasesByUser
);
router.get(
    '/product/:productId',
    authMiddleware,
    adminMiddleware,
    getPurchasesByProduct
);

module.exports = router;

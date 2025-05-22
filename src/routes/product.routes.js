const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    createProduct,
    updateProduct,
} = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', authMiddleware, getAllProducts);
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.patch('/:id', authMiddleware, adminMiddleware, updateProduct); // <-- rota de atualização

module.exports = router;

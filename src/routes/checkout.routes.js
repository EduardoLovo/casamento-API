const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { checkout } = require('../controllers/checkout.controller');

router.post('/', authMiddleware, checkout);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
    createCompanion,
    getUserWithCompanion,
} = require('../controllers/companion.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post('/', authMiddleware, createCompanion);
router.get('/', authMiddleware, adminMiddleware, getUserWithCompanion);
router.get('/lista-de-confirmados', getUserWithCompanion);

module.exports = router;

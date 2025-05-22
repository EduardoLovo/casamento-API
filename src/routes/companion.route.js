const express = require('express');
const router = express.Router();
const {
    createCompanion,
    getUserWithCompanion,
} = require('../controllers/companion.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post('/', adminMiddleware, authMiddleware, createCompanion); // usuário envia mensagem
router.get('/', adminMiddleware, getUserWithCompanion); // admin pode ver todas as mensagens
router.get('/lista-de-confirmados', getUserWithCompanion); // admin pode ver todas as mensagens

module.exports = router;

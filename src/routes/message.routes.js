// routes/mensageRoutes.js
const express = require('express');
const router = express.Router();
const {
    createMensage,
    listMensages,
} = require('../controllers/message.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post('/', authMiddleware, createMensage); // usuário envia mensagem
router.get('/', authMiddleware, adminMiddleware, listMensages); // admin pode ver todas as mensagens

module.exports = router;

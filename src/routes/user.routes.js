const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    updateUser,
    getUserById,
} = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', authMiddleware, adminMiddleware, getAllUsers, (req, res) => {
    res.json({ message: 'Você é admin' });
});
router.get('/', authMiddleware, getUserById);
router.patch('/:id', authMiddleware, updateUser);

module.exports = router;

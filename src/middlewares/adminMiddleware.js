// middlewares/adminMiddleware.js
const prisma = require('../prisma/client');

const adminMiddleware = async (req, res, next) => {
    const user = await prisma.user.findUnique({
        where: { id: req.userId },
    });

    if (!user || user.role !== 'admin') {
        return res
            .status(403)
            .json({ message: 'Acesso negado. Apenas admins.' });
    }

    next();
};

module.exports = adminMiddleware;

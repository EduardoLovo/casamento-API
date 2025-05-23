const prisma = require('../prisma/client');

const adminMiddleware = async (req, res, next) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || user.role !== 'admin') {
            return res
                .status(403)
                .json({ message: 'Acesso negado. Apenas admins.' });
        }

        next();
    } catch (error) {
        console.error('Erro no adminMiddleware:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

module.exports = adminMiddleware;

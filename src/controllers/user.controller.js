const prisma = require('../prisma/client');

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                presence: true,
                role: true,
                fone: true,
            },
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                email: true,
                presence: true,
                role: true,
                fone: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o usuário' });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { presence } = req.body;
    const { fone } = req.body;

    try {
        const userExists = await prisma.user.findUnique({
            where: { id },
        });

        if (!userExists) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { presence, fone },
            select: {
                id: true,
                presence: true,
            },
        });

        res.json(updatedUser);
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: 'Erro ao confirmar presença' });
    }
};

module.exports = { getAllUsers, updateUser, getUserById };

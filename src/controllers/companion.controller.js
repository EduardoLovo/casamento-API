const prisma = require('../prisma/client');

// Criar um novo Companion para um User
const createCompanion = async (req, res) => {
    const { companions } = req.body;

    const userId = req.userId; // precisa do middleware de autenticação

    if (!companions || !userId) {
        return res.status(400).json({ error: 'Conteúdo ou usuário inválido.' });
    }

    const userExists = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!userExists) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    try {
        // Cria múltiplos companions
        const createdCompanions = await prisma.companion.createMany({
            data: companions.map((companion) => ({
                name: companion.name,
                userId: userId,
            })),
        });
        // console.log(createdCompanions);

        return res.status(201).json(createdCompanions);
    } catch (error) {
        console.error('Erro ao criar companion:', error); // 👈 Log detalhado
        res.status(500).json({ error: 'Erro ao criar convidado' });
    }
};

const getUserWithCompanion = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { companions: true },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao buscar usuários com convidados',
        });
    }
};

module.exports = {
    createCompanion,
    getUserWithCompanion,
};

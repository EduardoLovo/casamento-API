const prisma = require('../prisma/client');

// Criar uma nova mensagem
const createMensage = async (req, res) => {
    const { content } = req.body;
    const userId = req.userId; // precisa do middleware de autenticação

    if (!content || !userId) {
        return res.status(400).json({ error: 'Conteúdo ou usuário inválido.' });
    }

    const userExists = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!userExists) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    try {
        const message = await prisma.message.create({
            data: {
                content,
                userId,
            },
        });

        return res.status(201).json(message);
    } catch (error) {
        console.error('Erro ao salvar a mensagem:', error); // isso mostra o motivo exato
        return res.status(500).json({ error: 'Erro ao salvar a mensagem.' });
    }
};

// Listar todas as mensagens com nome do usuário
const listMensages = async (req, res) => {
    try {
        const message = await prisma.message.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return res.json(message);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar mensagens.' });
    }
};

module.exports = {
    createMensage,
    listMensages,
};

const prisma = require('../prisma/client');

// GET /purchases
const getAllPurchases = async (req, res) => {
    try {
        const purchases = await prisma.purchase.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        image: true,
                    },
                },
            },
        });

        res.json(purchases);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar compras' });
    }
};

// purchases.controller.js
const getPurchasesByUser = async (req, res) => {
    const { userId } = req.params;

    const purchases = await prisma.purchase.findMany({
        where: { userId },
        include: { product: true }, // traz informações do produto
    });

    res.json(purchases);
};

const getPurchasesByProduct = async (req, res) => {
    const { productId } = req.params;

    const purchases = await prisma.purchase.findMany({
        where: { productId },
        include: { user: true }, // traz informações do usuário
    });

    res.json(purchases);
};

// POST /purchases
const createPurchase = async (req, res) => {
    const { productId } = req.body;
    const userId = req.userId; // vem do middleware

    try {
        const purchase = await prisma.purchase.create({
            data: {
                userId,
                productId,
            },
        });

        res.json(purchase);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar compra' });
    }
};

module.exports = {
    getAllPurchases,
    createPurchase,
    getPurchasesByUser,
    getPurchasesByProduct,
};

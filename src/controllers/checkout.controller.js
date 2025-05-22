const prisma = require('../prisma/client');

// POST /checkout
const checkout = async (req, res) => {
    const { productId, paymentMethod } = req.body;
    const userId = req.userId; // Pegamos do token (authMiddleware)

    try {
        // Verificar se o produto existe
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        // Criar a compra
        const purchase = await prisma.purchase.create({
            data: {
                userId,
                productId,
                paymentMethod,
                status: 'confirmed',
            },
            include: {
                user: true,
                product: true,
            },
        });

        res.status(201).json({
            message: 'Compra realizada com sucesso!',
            purchase,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao processar checkout' });
    }
};

module.exports = {
    checkout,
};

const prisma = require('../prisma/client');

// GET /products
const getAllProducts = async (req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
};

// POST /products
const createProduct = async (req, res) => {
    const { name, price, image } = req.body;
    const newProduct = await prisma.product.create({
        data: { name, price, image },
    });
    res.json(newProduct);
};

// PATCH /products/:id
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, image } = req.body;

    try {
        const updated = await prisma.product.update({
            where: { id },
            data: { name, price, image },
        });

        res.json(updated);
    } catch (error) {
        res.status(404).json({ error: 'Produto não encontrado' });
    }
};

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
};

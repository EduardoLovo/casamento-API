const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');
const { sendWelcomeEmail } = require('../utils/mailer');

const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ error: 'Usuário já existe' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role: role || 'common' },
    });

    // 🔥 Gerar token automático ao cadastrar
    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    // Envia e-mail de boas-vindas
    await sendWelcomeEmail(user.email, user.name);

    res.status(201).json({
        message: 'Usuário criado',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            presence: user.presence,
            role: user.role,
        },
        token,
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Senha incorreta' });

    // 🔥 Aqui você gera o token, incluindo o role:
    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            presence: user.presence,
            role: user.role,
        },
    });
};

module.exports = { register, login };

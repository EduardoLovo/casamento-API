const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');
const { sendWelcomeEmail } = require('../utils/mailer');
const axios = require('axios');

const register = async (req, res) => {
    const { name, email, password, role, recaptchaToken } = req.body;

    if (!recaptchaToken) {
        return res.status(400).json({ error: 'ReCAPTCHA token missing' });
    }

    // Validar token no Google
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`
        );

        if (!response.data.success || response.data.score < 0.5) {
            return res
                .status(403)
                .json({ error: 'ReCAPTCHA validation failed' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao validar reCAPTCHA' });
    }

    // Continuação do cadastro
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ error: 'Usuário já existe' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role: role || 'common' },
    });

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

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
    try {
        const { email, password, recaptchaToken } = req.body;

        if (!recaptchaToken) {
            return res.status(400).json({ error: 'ReCAPTCHA token missing' });
        }

        // Validar token no Google reCAPTCHA
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`
        );

        console.log('Resposta do Google reCAPTCHA:', response.data);

        if (!response.data.success || response.data.score < 0.5) {
            return res
                .status(403)
                .json({ error: 'ReCAPTCHA validation failed' });
        }

        // Buscar usuário no banco
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Validar senha
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        // Gerar JWT
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Responder com dados do usuário e token
        return res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                presence: user.presence,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

module.exports = { register, login };

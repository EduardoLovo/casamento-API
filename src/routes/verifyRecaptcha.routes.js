// routes/verifyRecaptcha.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/verify-recaptcha', async (req, res) => {
    const token = req.body.token;

    if (!token) {
        return res
            .status(400)
            .json({ success: false, message: 'Token não fornecido' });
    }

    try {
        const secret = process.env.RECAPTCHA_SECRET_KEY; // chave do seu .env
        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            {
                params: {
                    secret: secret,
                    response: token,
                },
            }
        );

        const { success, score, action } = response.data;

        if (!success || score < 0.5) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: 'Verificação reCAPTCHA falhou',
                });
        }

        return res.json({
            success: true,
            message: 'Verificação reCAPTCHA bem-sucedida',
        });
    } catch (error) {
        console.error('Erro ao verificar reCAPTCHA:', error.message);
        return res
            .status(500)
            .json({ success: false, message: 'Erro ao verificar reCAPTCHA' });
    }
});

module.exports = router;

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // ou outro serviço (ex: 'hotmail', 'outlook')
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

const sendWelcomeEmail = async (to, name) => {
    await transporter.sendMail({
        from: `"Casamento App" <${process.env.GMAIL_USER}>`,
        to,
        subject: 'Bem-vindo ao Casamento!',
        html: `<h2>Olá, ${name} !</h2><p>Seu cadastro foi realizado com sucesso. Seja bem-vindo! 💍</p>`,
    });
};

module.exports = { sendWelcomeEmail };

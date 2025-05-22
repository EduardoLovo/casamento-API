const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const serverless = require('serverless-http'); // ✅ importante para Vercel

const productRoutes = require('./routes/product.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const purchasesRoutes = require('./routes/purchases.routes');
const checkoutRoutes = require('./routes/checkout.routes');
const mensageRoutes = require('./routes/message.routes');
const companionRoutes = require('./routes/companion.route');

dotenv.config();
const app = express();

app.use(
    cors({
        origin: ['http://localhost:3000', 'https://seu-frontend.vercel.app'], // coloque os domínios permitidos
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    })
);

app.use(express.json());

app.get('/', async (req, res) => {
    res.send('API Casamento!');
});

app.use('/product', productRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/purchases', purchasesRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/messages', mensageRoutes);
app.use('/companions', companionRoutes);

module.exports = app;
module.exports.handler = serverless(app);

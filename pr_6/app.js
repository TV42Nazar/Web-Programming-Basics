const { apiLimiter } = require('./src/middlewares/security');

require('dotenv').config(); // Завантаження змінних з .env
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');

// Імпорт налаштувань Passport
require('./config/passport'); 

// Імпорт роутерів
const authRoutes = require('./src/routes/auth.routes');
const apiRoutes = require('./src/routes/api.routes');

const app = express();

// 1. Базовий захист HTTP-заголовків (XSS та ін.)
app.use(helmet());

// Парсинг JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 2. Налаштування безпечних сесій
app.use(session({
    name: 'hp_session_id', // Змінюємо стандартне ім'я cookie
    secret: process.env.SESSION_SECRET || 'fallback-dev-secret-key-change-it',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,  // Забороняє доступ до cookie через JavaScript (захист від XSS)
        secure: process.env.NODE_ENV === 'production', // Тільки HTTPS у продакшені
        sameSite: 'strict', // Захист від CSRF
        maxAge: 15 * 60 * 1000 // Життя сесії за замовчуванням (15 хвилин)
    }
}));

// 3. Ініціалізація PassportJS
app.use(passport.initialize());
app.use(passport.session());

// 4. Підключення роутів
app.use('/auth', authRoutes);
app.use('/api', apiLimiter, apiRoutes);

// Обробка 404
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не знайдено' });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер безпеки теплових насосів запущено на порту ${PORT}`);
});
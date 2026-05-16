// src/middlewares/security.js
const rateLimit = require('express-rate-limit');

// Обмеження для авторизації (захист від Brute-force)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 хвилин
    max: 5, // Максимум 5 спроб з одного IP
    message: { error: 'Забагато спроб входу. Спробуйте пізніше через 15 хвилин.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Загальне обмеження для API (захист від DDoS)
const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 хвилин
    max: 100, // Максимум 100 запитів
    message: { error: 'Перевищено ліміт запитів до API.' }
});

module.exports = { authLimiter, apiLimiter };
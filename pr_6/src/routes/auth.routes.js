// src/routes/auth.routes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authLimiter } = require('../middlewares/security');

// Middleware для перевірки помилок валідації
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};  

router.post('/register', 
    [
        body('email').isEmail().withMessage('Некоректний формат email').normalizeEmail(),
        body('password').isLength({ min: 8 }).withMessage('Пароль має містити мінімум 8 символів').trim().escape(),
        body('role').isIn(['resident', 'technician', 'facility_manager']).withMessage('Неприпустима роль'),
        body('apartmentId').optional().trim().escape()
    ],
    validate,
    authController.register
);

router.get('/verify/:token', authController.verifyEmail);

// Додаємо authLimiter для захисту від підбору паролів
router.post('/login', authLimiter, authController.login);

module.exports = router;
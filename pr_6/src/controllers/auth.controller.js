// src/controllers/auth.controller.js
const bcrypt = require('bcrypt');
const passport = require('passport');
const authService = require('../../services/auth.service')
const { users } = require('../../config/database');

// Реєстрація користувача
exports.register = async (req, res) => {
    const { email, password, role, apartmentId } = req.body;

    // 1. Перевірка стійкості пароля
    const passwordCheck = authService.validatePasswordStrength(password);
    if (!passwordCheck.isValid) {
        return res.status(400).json({ 
            error: 'Пароль занадто слабкий.', 
            suggestions: passwordCheck.suggestions 
        });
    }

    // 2. Перевірка на дублікат
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Користувач з таким email вже існує.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken = authService.generateVerificationToken();

        const newUser = {
            id: Date.now().toString(),
            email,
            password: hashedPassword,
            role, // 'resident', 'technician', 'facility_manager'
            apartmentId: role === 'resident' ? apartmentId : null,
            isVerified: false,
            verificationToken
        };

        users.push(newUser);

        // Виводимо токен у консоль для тестування (імітація відправки email)
        console.log(`[EMAIL SIMULATION] Токен для ${email}: ${verificationToken}`);

        res.status(201).json({ message: 'Реєстрація успішна. Перевірте консоль сервера для підтвердження email.' });
    } catch (error) {
        res.status(500).json({ error: 'Внутрішня помилка сервера.' });
    }
};

// Верифікація email
exports.verifyEmail = (req, res) => {
    const token = req.params.token;
    const user = users.find(u => u.verificationToken === token);
    
    if (!user) {
        return res.status(400).json({ error: 'Невірний або прострочений токен.' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    res.status(200).json({ message: 'Email успішно підтверджено. Тепер ви можете увійти.' });
};

// Вхід у систему (Логін)
exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: info.message });

        req.logIn(user, (err) => {
            if (err) return next(err);

            // Захист від Session Fixation: змінюємо ID сесії після входу
            const tempPassportSession = req.session.passport;
            req.session.regenerate((err) => {
                if (err) return next(err);
                req.session.passport = tempPassportSession;

                // Secure Remember Me
                if (req.body.rememberMe === true) {
                    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 днів
                } else {
                    req.session.cookie.expires = false; // Видаляється при закритті браузера
                }

                res.status(200).json({ message: 'Вхід успішний', role: user.role });
            });
        });
    })(req, res, next);
};
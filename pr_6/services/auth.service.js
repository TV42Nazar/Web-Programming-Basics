// src/services/auth.service.js
const zxcvbn = require('zxcvbn');
const crypto = require('crypto');

class AuthService {
    // Оцінка стійкості пароля
    validatePasswordStrength(password) {
        const analysis = zxcvbn(password);
        return {
            isValid: analysis.score >= 3, // Вимагаємо мінімум 3 з 4
            score: analysis.score,
            suggestions: analysis.feedback.suggestions
        };
    }

    // Генерація безпечного випадкового токена для email
    generateVerificationToken() {
        return crypto.randomBytes(32).toString('hex');
    }
}

module.exports = new AuthService();
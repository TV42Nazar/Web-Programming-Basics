// config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { users } = require('./database');

passport.use(new LocalStrategy({ 
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    // Шукаємо користувача
    const user = users.find(u => u.email === email);
    if (!user) {
        return done(null, false, { message: 'Невірний email або пароль.' });
    }
    
    // Захист: перевірка верифікації пошти
    if (!user.isVerified) {
        return done(null, false, { message: 'Будь ласка, підтвердіть ваш email перед входом.' });
    }

    try {
        // Беріть до уваги bcrypt.compare для захисту від атак за часом
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Невірний email або пароль.' });
        }
    } catch (err) {
        return done(err);
    }
}));

// Зберігаємо у сесію лише ID користувача для економії пам'яті
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// За ID відновлюємо об'єкт користувача при кожному запиті
passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    if (!user) return done(new Error('Користувача не знайдено'));
    done(null, user);
});

module.exports = passport;
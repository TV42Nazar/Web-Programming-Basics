// src/middlewares/auth.middleware.js

// 1. Перевірка, чи користувач взагалі залогінений
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: 'Доступ заборонено. Необхідно увійти в систему.' });
}

// 2. Перевірка Ролей (Role-Based Access Control)
function checkRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Недостатньо прав для виконання цієї операції.' });
        }
        next();
    };
}

// 3. Перевірка власності (Attribute-Based Access Control)
// Захищає від ситуації, коли Resident намагається змінити температуру сусіда
function checkApartmentOwnership(req, res, next) {
    if (req.user.role === 'resident') {
        const targetApartment = req.body.apartmentId;
        if (targetApartment !== req.user.apartmentId) {
            return res.status(403).json({ error: 'Ви можете керувати тепловим насосом тільки своєї квартири.' });
        }
    }
    next();
}

module.exports = {
    isAuthenticated,
    checkRole,
    checkApartmentOwnership
};
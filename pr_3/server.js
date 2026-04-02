const express = require('express');
const fs = require('fs'); // Модуль для роботи з файловою системою
const path = require('path'); // Модуль для роботи зі шляхами до файлів

const app = express();
const PORT = 3000;
// Визначаємо шлях до JSON-файлу, який буде нашою базою даних
const DB_FILE = path.join(__dirname, 'data', 'dgu_db.json');

// Middleware для автоматичного парсингу JSON у тілі запиту (req.body)
app.use(express.json());
// Робимо папку 'public' статичною, щоб браузер міг завантажувати HTML/CSS/JS фронтенду
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Допоміжна функція для читання даних з файлу
 * @returns {Array} Масив об'єктів ДГУ
 */
const readDB = () => {
    try {
        // Читаємо файл у форматі utf8
        const data = fs.readFileSync(DB_FILE, 'utf8');
        // Перетворюємо рядок у масив об'єктів
        return JSON.parse(data);
    } catch (error) {
        // Якщо файлу не існує або він порожній, повертаємо порожній масив
        return [];
    }
};

/**
 * Допоміжна функція для запису даних у файл
 * @param {Array} data - Масив об'єктів для збереження
 */
const writeDB = (data) => {
    // Записуємо дані у файл з відступами (2 пробіли) для зручності читання людиною
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// Ендпоінт GET /api/dgu — повертає список усіх ДГУ
app.get('/api/dgu', (req, res) => {
    const dguList = readDB();
    res.json(dguList); // Відправляємо дані клієнту у форматі JSON
});

// Ендпоінт POST /api/dgu — додає нову установку
app.post('/api/dgu', (req, res) => {
    // Деструктуризація даних, що прийшли від фронтенду
    const { objectName, type, power, fuel, consumption, maintenance } = req.body;

    // Валідація 1: Перевірка на заповнення всіх полів
    if (!objectName || !type || !power || !fuel || !consumption || !maintenance) {
        return res.status(400).json({ error: "Всі поля є обов'язковими" });
    }
    
    // Валідація 2: Перевірка числових значень
    if (Number(power) <= 0 || Number(consumption) <= 0) {
        return res.status(400).json({ error: "Потужність та витрата повинні бути більше нуля" });
    }

    // Створюємо новий об'єкт ДГУ з унікальним ID (на основі мілісекунд)
    const newDGU = {
        id: Date.now().toString(),
        objectName,
        type,
        power: Number(power), // Гарантуємо, що це число
        fuel,
        consumption: Number(consumption),
        maintenance
    };

    // Отримуємо поточні дані, додаємо новий запис і зберігаємо назад у файл
    const dguList = readDB();
    dguList.push(newDGU);
    writeDB(dguList);

    // Повертаємо статус 201 (Created) та інформацію про створений об'єкт
    res.status(201).json({ message: "ДГУ успішно додано", data: newDGU });
});

// Запуск сервера на вказаному порту
app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});
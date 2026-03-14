const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit-data', (req, res) => {
    const newData = req.body;
    newData.timestamp = new Date().toISOString();

    let dataArray = [];
    if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        try {
            dataArray = JSON.parse(fileContent);
        } catch (e) {
            console.error('Помилка читання JSON');
        }
    }

    // Додаємо новий запис та зберігаємо
    dataArray.push(newData);
    fs.writeFileSync(DB_FILE, JSON.stringify(dataArray, null, 2));

    res.send(`
        <div style="font-family: Arial; text-align: center; margin-top: 50px;">
            <h2 style="color: green;">Дані успішно збережено!</h2>
            <a href="/">Повернутися до форми</a>
        </div>
    `);
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});
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
        try { dataArray = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')); } 
        catch (e) { console.error('Помилка JSON'); }
    }

    dataArray.push(newData);
    fs.writeFileSync(DB_FILE, JSON.stringify(dataArray, null, 2));
    res.redirect('/');
});


app.get('/api/data/latest', (req, res) => {
    if (fs.existsSync(DB_FILE)) {
        try {
            const dataArray = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
            if (dataArray.length > 0) return res.json(dataArray[dataArray.length - 1]);
        } catch (e) { return res.status(500).json({ error: 'Помилка читання' }); }
    }
    res.json(null);
});


app.get('/api/data/history', (req, res) => {
    const fs = require('fs');
    if (fs.existsSync(DB_FILE)) {
        try {
            const dataArray = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
            res.json(dataArray.slice(-15));
        } catch (e) {
            res.status(500).json({ error: "Помилка читання бази" });
        }
    } else {
        res.json([]); 
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});
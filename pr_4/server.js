const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
// дозволяє серверу показувати файли з папки public
app.use(express.static('public'));

let lightingSystems = [
    {
        id: 1,
        name: "Вулиця Хрещатик",
        lampCount: 120,
        activeLamps: 120,
        totalPower: 12.5,
        brightness: 100,
        mode: "schedule",
        energyConsumed: 4500.2,
        lightLevel: 10
    },
    {
        id: 2,
        name: "Парк Шевченка",
        lampCount: 45,
        activeLamps: 0,
        totalPower: 0,
        brightness: 0,
        mode: "auto",
        energyConsumed: 850.5,
        lightLevel: 150 // Світло, тому ліхтарі вимкнені
    }
];

// Імітація бази розкладів (оскільки розклад не є прямим полем об'єкта)
const schedules = {
    1: { timeOn: "18:00", timeOff: "06:00", activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    2: { timeOn: "19:00", timeOff: "05:00", activeDays: ["Mon", "Wed", "Fri"] }
};

// 1. GET /api/lighting-systems - Отримати всі системи освітлення
app.get('/api/lighting-systems', (req, res) => {
    res.status(200).json(lightingSystems);
});

// 2. GET /api/lighting-systems/:id - Отримати конкретну систему
app.get('/api/lighting-systems/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const system = lightingSystems.find(s => s.id === id);

    if (!system) {
        return res.status(404).json({ error: "Систему не знайдено" });
    }
    res.status(200).json(system);
});

// 3. POST /api/lighting-systems/:id/control - Керування світильниками
app.post('/api/lighting-systems/:id/control', (req, res) => {
    const id = parseInt(req.params.id);
    const { mode, activeLamps } = req.body;
    const system = lightingSystems.find(s => s.id === id);

    if (!system) {
        return res.status(404).json({ error: "Систему не знайдено" });
    }

    // Оновлення параметрів керування
    if (mode && ['auto', 'manual', 'schedule'].includes(mode)) {
        system.mode = mode;
    }

    if (typeof activeLamps === 'number' && activeLamps >= 0 && activeLamps <= system.lampCount) {
        system.activeLamps = activeLamps;
        // Пропорційно змінюємо споживану потужність (умовно 0.1 кВт на 1 ліхтар при 100% яскравості)
        system.totalPower = +(activeLamps * 0.1 * (system.brightness / 100)).toFixed(2);
    }

    res.status(200).json({ message: "Керування застосовано успішно", system });
});

// 4. GET /api/lighting-systems/:id/schedule - Отримати розклад роботи системи
app.get('/api/lighting-systems/:id/schedule', (req, res) => {
    const id = parseInt(req.params.id);
    const system = lightingSystems.find(s => s.id === id);

    if (!system) {
        return res.status(404).json({ error: "Систему не знайдено" });
    }

    const schedule = schedules[id] || { message: "Розклад не встановлено" };
    res.status(200).json({ systemId: id, schedule });
});

// 5. PUT /api/lighting-systems/:id/brightness - Змінити яскравість
app.put('/api/lighting-systems/:id/brightness', (req, res) => {
    const id = parseInt(req.params.id);
    const { brightness } = req.body;
    const system = lightingSystems.find(s => s.id === id);

    if (!system) {
        return res.status(404).json({ error: "Систему не знайдено" });
    }

    if (typeof brightness !== 'number' || brightness < 0 || brightness > 100) {
        return res.status(400).json({ error: "Яскравість має бути числом від 0 до 100" });
    }

    system.brightness = brightness;
    // Оновлюємо потужність відповідно до нової яскравості
    system.totalPower = +(system.activeLamps * 0.1 * (brightness / 100)).toFixed(2);

    res.status(200).json({ message: "Яскравість оновлено", system });
});

// 6. DELETE /api/lighting-systems/:id - Видалити систему
app.delete('/api/lighting-systems/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = lightingSystems.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Систему не знайдено" });
    }

    const deletedSystem = lightingSystems.splice(index, 1);
    delete schedules[id]; // Видаляємо розклад також

    res.status(200).json({ message: "Систему успішно видалено", deleted: deletedSystem[0] });
});
//запуск
app.listen(PORT, () => {
    console.log(`Сервер запущено: http://localhost:${PORT}`);
});
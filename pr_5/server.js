const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Роздаємо статичні файли з папки public
app.use(express.static(path.join(__dirname, 'public')));

// Логіка WebSocket
wss.on('connection', (ws) => {
    console.log('Клієнт підключився до дашборда');

    // Імітація даних з ПЛК (програмованого логічного контролера)
    const interval = setInterval(() => {
        const data = {
            timestamp: new Date().toLocaleTimeString(),
            biogasVolume: (500 + Math.random() * 20).toFixed(1), // 500-520 м3/год
            methane: (60 + Math.random() * 5).toFixed(1),        // 60-65 %
            power: (1200 + Math.random() * 50).toFixed(0),       // 1200-1250 кВт
            temperature: (39 + Math.random() * 1.5).toFixed(1),  // 39-40.5 °C
            substrate: 50 // т/добу (стале значення для прикладу)
        };
        
        ws.send(JSON.stringify(data));
    }, 2000);

    ws.on('close', () => {
        console.log('Клієнт відключився');
        clearInterval(interval);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущено: http://localhost:${PORT}`);
});
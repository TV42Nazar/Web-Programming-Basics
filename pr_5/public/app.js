// 1. Ініціалізація графіків (Chart.js)
const biogasCtx = document.getElementById('biogasChart').getContext('2d');
const gasCompCtx = document.getElementById('gasCompositionChart').getContext('2d');

const biogasChart = new Chart(biogasCtx, {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'Виробництво біогазу (м³/год)', data: [], borderColor: '#3498db', tension: 0.4 }] },
    options: { responsive: true, scales: { y: { min: 450, max: 550 } } }
});

const gasCompositionChart = new Chart(gasCompCtx, {
    type: 'doughnut',
    data: {
        labels: ['Метан (CH4)', 'Вуглекислий газ (CO2) & Інше'],
        datasets: [{ data: [0, 100], backgroundColor: ['#2ecc71', '#95a5a6'] }]
    },
    options: { responsive: true }
});

// 2. DOM Елементи
const statusEl = document.getElementById('connection-status');
const valPower = document.getElementById('val-power');
const valTemp = document.getElementById('val-temp');
const valTempContainer = document.getElementById('val-temp-container');
const valSubstrate = document.getElementById('val-substrate');
const tableBody = document.getElementById('table-body');

// 3. Підключення через WebSocket
const ws = new WebSocket(`ws://${window.location.host}`);

ws.onopen = () => {
    statusEl.textContent = 'Підключено';
    statusEl.className = 'status connected';
};

ws.onclose = () => {
    statusEl.textContent = 'Відключено';
    statusEl.className = 'status disconnected';
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updateDashboard(data);
};

// 4. Функція оновлення інтерфейсу
function updateDashboard(data) {
    // Оновлення карток
    valPower.textContent = data.power;
    valSubstrate.textContent = data.substrate;
    valTemp.textContent = data.temperature;

    // Сигналізація температури (якщо > 40°C - червоний колір)
    if (parseFloat(data.temperature) > 40.0) {
        valTempContainer.classList.add('warning');
    } else {
        valTempContainer.classList.remove('warning');
    }

    // Оновлення лінійного графіка (зберігаємо останні 10 точок)
    if (biogasChart.data.labels.length > 10) {
        biogasChart.data.labels.shift();
        biogasChart.data.datasets[0].data.shift();
    }
    biogasChart.data.labels.push(data.timestamp);
    biogasChart.data.datasets[0].data.push(data.biogasVolume);
    biogasChart.update();

    // Оновлення кругової діаграми
    const methaneVal = parseFloat(data.methane);
    gasCompositionChart.data.datasets[0].data = [methaneVal, 100 - methaneVal];
    gasCompositionChart.update();

    // Оновлення таблиці (додаємо рядок зверху, тримаємо макс 5 рядків)
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${data.timestamp}</td>
        <td>${data.biogasVolume}</td>
        <td>${data.methane}</td>
        <td>${data.power}</td>
        <td>${data.temperature}</td>
    `;
    tableBody.insertBefore(newRow, tableBody.firstChild);
    if (tableBody.children.length > 5) {
        tableBody.removeChild(tableBody.lastChild);
    }
}
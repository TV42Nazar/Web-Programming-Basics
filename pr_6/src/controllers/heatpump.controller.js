// src/controllers/heatpump.controller.js

exports.setTemperature = (req, res) => {
    const { apartmentId, targetTemperature } = req.body;
    // Тут була б логіка звернення до IoT пристрою
    res.status(200).json({ 
        message: `Температуру для квартири ${apartmentId} встановлено на ${targetTemperature}°C.` 
    });
};

exports.scheduleMaintenance = (req, res) => {
    const { pumpId, maintenanceDate } = req.body;
    res.status(200).json({ 
        message: `Технічне обслуговування насосу ${pumpId} заплановано на ${maintenanceDate}.` 
    });
};

exports.getSystemEfficiency = (req, res) => {
    res.status(200).json({ 
        status: "Оптимальний",
        overallCOP: 4.2,
        activePumps: 45,
        loadDistribution: "Баланс збережено"
    });
};
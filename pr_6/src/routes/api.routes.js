// src/routes/api.routes.js
const express = require('express');
const router = express.Router();
const heatpumpController = require('../controllers/heatpump.controller');
const { isAuthenticated, checkRole, checkApartmentOwnership } = require('../middlewares/auth.middleware');

// Resident: Керування своєю квартирою
router.post('/heatpump/temperature', 
    isAuthenticated, 
    checkRole(['resident']), 
    checkApartmentOwnership, 
    heatpumpController.setTemperature
);

// Technician: Обслуговування
router.post('/maintenance/schedule', 
    isAuthenticated, 
    checkRole(['technician']), 
    heatpumpController.scheduleMaintenance
);

// Facility Manager: Загальна статистика
router.get('/system/efficiency', 
    isAuthenticated, 
    checkRole(['facility_manager']), 
    heatpumpController.getSystemEfficiency
);

module.exports = router;
// server/src/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const EventController = require('../controllers/EventController');
const authMiddleware = require('../middleware/authMiddleware');

// Endpoint lấy danh sách sự kiện
router.get('/', authMiddleware, EventController.getEvents);

// Endpoint tạo mới sự kiện
router.post('/', authMiddleware, EventController.createEvent);

module.exports = router;

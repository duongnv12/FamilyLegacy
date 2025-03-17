// server/src/routes/authRoutes.js
const router = require('express').Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Các endpoint công khai không cần auth:
router.post('/register', authController.register);
router.post('/login', authController.login);

// Các endpoint cần bảo vệ:
router.get('/accounts', authMiddleware, authController.getAccounts);
router.put('/accounts/:id', authMiddleware, authController.updateAccount);

module.exports = router;

const router = require('express').Router();
const familyController = require('../controllers/familyController');
const authMiddleware = require('../middleware/authMiddleware');

// Tạo mới thành viên
router.post('/create', authMiddleware, familyController.createMember);

// Lấy danh sách thành viên
router.get('/members', authMiddleware, familyController.getMembers);

// Cập nhật thông tin thành viên
router.put('/members/:id', authMiddleware, familyController.updateMember);

// Thống kê thành viên theo tiêu chí
router.get('/stats', authMiddleware, familyController.statsMembers);

module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const ContributionController = require('../controllers/ContributionController');
const VoluntaryContributionController = require('../controllers/VoluntaryContributionController');
const TransactionController = require('../controllers/TransactionController');
const EventBudgetController = require('../controllers/EventBudgetController');
const ExpenseProposalController = require('../controllers/ExpenseProposalController');
const EventExpenseController = require('../controllers/EventExpenseController');

// UC-TT01: Thiết lập mức đóng góp
router.post('/set-contribution', authMiddleware, ContributionController.setContribution);

// UC-TT02: Lấy trạng thái đóng góp theo năm
router.get('/contribution-status', authMiddleware, ContributionController.getContributionStatus);
router.put('/contribution-status/:id', authMiddleware, ContributionController.updateContributionStatus);

// UC-TT03: Ghi nhận khoản ủng hộ ngoài định mức
router.post('/voluntary-contribution', authMiddleware, VoluntaryContributionController.recordVoluntaryContribution);
router.get('/voluntary-contributions', authMiddleware, VoluntaryContributionController.getVoluntaryContributions);

// UC-TT04: Thống kê các khoản thu
router.get('/income-stats', authMiddleware, TransactionController.getIncomeStats);

// UC-TT05: Xác định ngân sách sự kiện
router.post('/event-budget', authMiddleware, EventBudgetController.setEventBudget);
router.get('/event-budget', authMiddleware, EventBudgetController.getEventBudgets);

// UC-TT06: Duyệt đề xuất chi tiêu
router.get('/expense-proposals', authMiddleware, ExpenseProposalController.getExpenseProposals);
router.put('/expense-proposals/:id', authMiddleware, ExpenseProposalController.updateExpenseProposal);

// UC-TT07: Ghi nhận các khoản chi cho sự kiện
router.post('/event-expense', authMiddleware, EventExpenseController.recordExpense);
router.get('/event-expense', authMiddleware, EventExpenseController.getEventExpenses);

// UC-TT08: Thống kê các khoản chi cho sự kiện
router.get('/expense-stats', authMiddleware, TransactionController.getExpenseStats);

module.exports = router;

// server/src/controllers/EventBudgetController.js
const EventBudget = require('../models/EventBudget');

exports.setEventBudget = async (req, res, next) => {
  try {
    const { eventId, budget, notes } = req.body;
    
    if (!eventId || !budget) {
      return res.status(400).json({ message: 'Tên sự kiện và ngân sách là bắt buộc.' });
    }
    if (Number(budget) <= 0) {
      return res.status(400).json({ message: 'Số tiền ngân sách phải lớn hơn 0.' });
    }
    
    // Tạo mới bản ghi ngân sách cho sự kiện.
    const eventBudget = new EventBudget({ eventId, budget, notes });
    await eventBudget.save();
    
    res.status(201).json({ message: 'Xác định ngân sách cho sự kiện thành công.', eventBudget });
  } catch (error) {
    console.error("Error in setEventBudget:", error);
    next(error);
  }
};

exports.getEventBudgets = async (req, res, next) => {
  try {
    // Lấy danh sách ngân sách, populate trường eventId để lấy tên sự kiện
    const eventBudgets = await EventBudget.find().populate('eventId', 'name');
    res.json({ eventBudgets });
  } catch (error) {
    console.error("Error fetching event budgets:", error);
    next(error);
  }
};

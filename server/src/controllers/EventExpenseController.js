// server/src/controllers/EventExpenseController.js
const Transaction = require('../models/Transaction');

exports.recordExpense = async (req, res, next) => {
  try {
    const { eventId, amount, date, description, responsiblePerson, notes } = req.body;
    if (!eventId || !amount || !date || !responsiblePerson) {
      return res.status(400).json({ message: 'Thông tin không đầy đủ để ghi nhận khoản chi.' });
    }
    const expenseDate = new Date(date);  // Nếu date chuyển từ client đã là chuỗi "YYYY-MM-DD"
    
    const expense = new Transaction({
      type: 'expense',
      description,
      amount,
      date: expenseDate,
      responsiblePerson,
      eventId,
      notes,
    });
    
    await expense.save();
    res.status(201).json({ message: 'Ghi nhận khoản chi thành công.', expense });
  } catch (error) {
    console.error("Error in recordExpense:", error);
    next(error);
  }
};

// Thêm hàm getEventExpenses để trả về danh sách các giao dịch chi
exports.getEventExpenses = async (req, res, next) => {
  try {
    const expenses = await Transaction.find({ type: 'expense' })
      .populate('eventId', 'name')
      .populate('responsiblePerson', 'name')
      .sort({ createdAt: -1 });  // Sắp xếp giảm dần theo ngày tạo
    res.json({ expenses });
  } catch (error) {
    console.error("Error fetching event expenses:", error);
    next(error);
  }
};

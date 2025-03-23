// server/src/controllers/EventBudgetController.js
const EventBudget = require('../models/EventBudget');
const FamilyMember = require('../models/FamilyMember'); // Giả sử sẽ cập nhật thông tin thành viên
const chalk = require('chalk');

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
    console.error(chalk.red("Error in setEventBudget:"), error);
    next(error);
  }
};

exports.getEventBudgets = async (req, res, next) => {
  try {
    // Lấy danh sách ngân sách, populate trường eventId để lấy tên sự kiện
    const eventBudgets = await EventBudget.find().populate('eventId', 'name');
    res.json({ eventBudgets });
  } catch (error) {
    console.error(chalk.red("Error fetching event budgets:"), error);
    next(error);
  }
};

/**
 * API duyệt thành viên tham gia sự kiện.
 * Endpoint: PUT /api/events/confirm-participation/:memberId
 * Payload: { eventId, contribution }
 */
exports.confirmParticipation = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const { eventId, contribution } = req.body;

    if (!eventId || contribution == null) {
      return res.status(400).json({ message: 'Event ID và số tiền đóng góp là bắt buộc.' });
    }
    
    // Ví dụ của chúng ta: cập nhật thông tin của thành viên (hoặc tạo giao dịch tham gia sự kiện)
    // Có thể quyết định lưu thông tin này vào model khác hoặc cập nhật trực tiếp vào thành viên.
    // Ở đây, giả sử ta cập nhật trường "participation" trong đối tượng thành viên (bạn cần bổ sung trường này trong FamilyMember.js nếu cần).
    const updatedMember = await FamilyMember.findByIdAndUpdate(memberId, 
      { 
        $set: { 
          "participation": { eventId, contribution } 
        } 
      }, { new: true }
    );
    if (!updatedMember) {
      return res.status(404).json({ message: 'Thành viên không tồn tại.' });
    }
    
    res.json({ message: 'Xác nhận tham gia sự kiện thành công.', updatedMember });
  } catch (error) {
    console.error(chalk.red("Error confirming participation:"), error);
    next(error);
  }
};

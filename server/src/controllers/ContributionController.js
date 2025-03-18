// server/src/controllers/ContributionController.js
const FinancialContribution = require('../models/FinancialContribution');
const ContributionStatus = require('../models/ContributionStatus');
const FamilyMember = require('../models/FamilyMember');

/**
 * setContribution: Thiết lập mức đóng góp cho năm.
 * Lưu FinancialContribution và tự động tạo (hoặc cập nhật) các bản ghi ContributionStatus 
 * cho tất cả các thành viên có status "Sống" với isPaid = false.
 */
exports.setContribution = async (req, res, next) => {
  try {
    const { year, amount, notes } = req.body;
    if (!year || !amount) {
      return res.status(400).json({ message: 'Năm và số tiền đóng góp là bắt buộc.' });
    }
    const contribution = new FinancialContribution({ year, amount, notes });
    await contribution.save();

    // Lấy danh sách các thành viên mới có status "Sống"
    const livingMembers = await FamilyMember.find({ status: 'Sống' });
    const bulkOps = livingMembers.map(member => ({
      updateOne: {
        filter: { memberId: member._id, year },
        update: { $set: { amount, isPaid: false } },
        upsert: true,
      }
    }));
    if (bulkOps.length > 0) {
      await ContributionStatus.bulkWrite(bulkOps);
    }
    
    res.status(201).json({ message: 'Thiết lập mức đóng góp thành công.', contribution });
  } catch (error) {
    console.error("Error in setContribution:", error);
    next(error);
  }
};

/**
 * recordIncome: Ghi nhận khoản thu theo định mức.
 * Yêu cầu các trường: memberId, year, amount, date, notes.
 * Tìm ContributionStatus của thành viên và đánh dấu isPaid = true.
 */
exports.recordIncome = async (req, res, next) => {
  try {
    const { memberId, year, amount, date, notes } = req.body;
    if (!memberId || !year || !amount || !date) {
      return res.status(400).json({ message: "Thông tin không đầy đủ." });
    }
    const statusRecord = await ContributionStatus.findOne({ memberId, year });
    if (!statusRecord) {
      return res.status(404).json({ message: "Không tìm thấy bản ghi đóng góp cho thành viên này trong năm chỉ định." });
    }
    statusRecord.isPaid = true;
    // Có thể cập nhật thêm thông tin nếu cần
    await statusRecord.save();
    res.status(201).json({ message: "Ghi nhận khoản thu thành công.", record: statusRecord });
  } catch (error) {
    console.error("Error in recordIncome:", error);
    next(error);
  }
};

/**
 * getContributionStatus: Lấy danh sách trạng thái đóng góp của các thành viên cho năm chỉ định.
 */
exports.getContributionStatus = async (req, res, next) => {
  try {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ message: 'Năm không được bỏ trống!' });
    }
    const statuses = await ContributionStatus.find({ year }).populate('memberId', 'name');
    const modifiedStatuses = statuses.map(item => ({
      _id: item._id,
      memberName: item.memberId.name,
      amount: item.amount,
      isPaid: item.isPaid
    }));
    res.json({ statuses: modifiedStatuses });
  } catch (error) {
    console.error("Error in getContributionStatus:", error);
    next(error);
  }
};

/**
 * updateContributionStatus: Cập nhật trạng thái đóng góp (ví dụ, đánh dấu đã đóng hay từ chối).
 */
exports.updateContributionStatus = async (req, res, next) => {
  try {
    const statusId = req.params.id;
    const { isPaid } = req.body;
    const updatedStatus = await ContributionStatus.findByIdAndUpdate(
      statusId,
      { isPaid },
      { new: true }
    );
    if (!updatedStatus) {
      return res.status(404).json({ message: 'Bản ghi đóng góp không tồn tại' });
    }
    res.json({ message: 'Cập nhật trạng thái đóng góp thành công', status: updatedStatus });
  } catch (error) {
    console.error("Error in updateContributionStatus:", error);
    next(error);
  }
};

// server/src/controllers/VoluntaryContributionController.js
const Transaction = require('../models/Transaction');
const FamilyMember = require('../models/FamilyMember');
const dayjs = require('dayjs');

/**
 * recordVoluntaryContribution:
 * Ghi nhận các khoản ủng hộ, khuyến góp ngoài định mức.
 *
 * Yêu cầu từ req.body:
 *  - contributor: ID của thành viên đóng góp.
 *  - amount: Số tiền đóng góp.
 *  - date: Ngày giao dịch theo định dạng "YYYY-MM-DD".
 *  - notes: (Tùy chọn) Ghi chú cho giao dịch.
 *  - contributionType: Loại đóng góp ("voluntary" cho Ủng hộ, "donation" cho Khuyến góp,
 *                        có thể mở rộng các loại khác nếu cần).
 *
 * Quá trình:
 *  1. Kiểm tra các trường bắt buộc (contributor, amount, date).
 *  2. Kiểm tra sự tồn tại của thành viên.
 *  3. Sử dụng dayjs để parse chuỗi ngày theo định dạng "YYYY-MM-DD".
 *  4. Xác định giá trị của trường type từ payload (hoặc mặc định là "voluntary").
 *  5. Đặt description dựa trên type.
 *  6. Tạo và lưu đối tượng Transaction.
 *  7. Populate trường contributor và trả về dữ liệu giao dịch.
 */
exports.recordVoluntaryContribution = async (req, res, next) => {
  try {
    const { contributor, amount, date, notes, contributionType } = req.body;
    
    if (!contributor || !amount || !date) {
      return res.status(400).json({ message: "Thông tin không đầy đủ. Yêu cầu contributor, amount và date." });
    }
    
    // Kiểm tra xem thành viên có tồn tại không
    const member = await FamilyMember.findById(contributor);
    if (!member) {
      return res.status(404).json({ message: "Thành viên không tồn tại." });
    }
    
    // Parse ngày theo định dạng "YYYY-MM-DD"
    const parsedDate = dayjs(date, 'YYYY-MM-DD', true); // strict parsing
    if (!parsedDate.isValid()) {
      return res.status(400).json({ message: "Ngày giao dịch không hợp lệ. Vui lòng sử dụng định dạng YYYY-MM-DD." });
    }
    const transactionDate = new Date(parsedDate.toISOString());
    
    // Xác định loại đóng góp: lấy từ payload hoặc mặc định là "voluntary"
    const type = contributionType ? contributionType : 'voluntary';
    const description = type === 'donation' 
      ? 'Khuyến góp ngoài định mức' 
      : 'Ủng hộ ngoài định mức';
    
    // Tạo giao dịch với type và description đã được xác định
    const transaction = new Transaction({
      contributor,
      amount,
      date: transactionDate,
      notes,
      type,
      description,
    });
    
    await transaction.save();
    
    // Populate thông tin thành viên (chỉ lấy trường name)
    const populatedTransaction = await Transaction.findById(transaction._id).populate('contributor', 'name');
    
    res.status(201).json({ message: "Ghi nhận khoản ủng hộ thành công.", transaction: populatedTransaction });
  } catch (error) {
    console.error("Error in recordVoluntaryContribution:", error);
    next(error);
  }
};

/**
 * getVoluntaryContributions:
 * Lấy danh sách các giao dịch ủng hộ, khuyến góp ngoài định mức.
 * Nếu có query parameter 'year', lọc giao dịch theo năm.
 */
exports.getVoluntaryContributions = async (req, res, next) => {
  try {
    const { year } = req.query;
    const query = { type: { $in: ['voluntary', 'donation'] } };
    if (year) {
      const startOfYear = new Date(`${year}-01-01T00:00:00Z`);
      const endOfYear = new Date(`${year}-12-31T23:59:59Z`);
      query.date = { $gte: startOfYear, $lte: endOfYear };
    }
    const transactions = await Transaction.find(query).populate('contributor', 'name');
    res.json({ transactions });
  } catch (error) {
    console.error("Error in getVoluntaryContributions:", error);
    next(error);
  }
};

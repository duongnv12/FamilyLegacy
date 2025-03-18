// server/src/controllers/FamilyMemberController.js
const FamilyMember = require('../models/FamilyMember');
const ContributionStatus = require('../models/ContributionStatus');
const FinancialContribution = require('../models/FinancialContribution');

/**
 * Tạo mới thành viên (UC-GT01 & UC-GT02)
 * Nếu role là "Founder" thì không được có parentId.
 * Sau khi tạo thành viên mới, nếu thành viên có status "Sống",
 * tự động tạo hoặc cập nhật các bản ghi ContributionStatus cho
 * mỗi năm đã thiết lập định mức đóng góp.
 */
exports.createMember = async (req, res, next) => {
  try {
    const { name, birthDate, gender, placeOfBirth, additionalInfo, role, parentId, status } = req.body;
    
    if (role === "Founder" && parentId) {
      return res.status(400).json({ message: "Founder không thể có parentId" });
    }
    
    const newMember = new FamilyMember({
      name,
      birthDate,
      gender,
      placeOfBirth,
      additionalInfo,
      role: role || 'Member',
      parentId: parentId || null,
      status, // "Sống" hoặc "Mất"
    });

    const savedMember = await newMember.save();

    // Nếu thành viên mới là "Sống", tạo ContributionStatus cho các năm đã định mức
    if (savedMember.status === 'Sống') {
      const contributions = await FinancialContribution.find();
      const bulkOps = contributions.map(contribution => ({
        updateOne: {
          filter: { memberId: savedMember._id, year: contribution.year },
          update: { $set: { amount: contribution.amount, isPaid: false } },
          upsert: true,
        }
      }));
      if (bulkOps.length > 0) {
        await ContributionStatus.bulkWrite(bulkOps);
      }
    }

    res.status(201).json({ message: "Thêm thành viên mới thành công!", member: savedMember });
  } catch (error) {
    console.error("Error in createMember:", error);
    next(error);
  }
};

/**
 * Cập nhật thông tin thành viên (UC-GT03)
 */
exports.updateMember = async (req, res, next) => {
  try {
    const memberId = req.params.id;
    const updateData = req.body;
    const updatedMember = await FamilyMember.findByIdAndUpdate(memberId, updateData, { new: true });
    if (!updatedMember) {
      return res.status(404).json({ message: "Thành viên không tồn tại" });
    }
    res.json({ message: "Cập nhật thông tin thành viên thành công", member: updatedMember });
  } catch (error) {
    console.error("Error in updateMember:", error);
    next(error);
  }
};

/**
 * Lấy danh sách thành viên (cho UC-GT04 & UC-GT05)
 */
exports.getMembers = async (req, res, next) => {
  try {
    const members = await FamilyMember.find();
    res.json({ members });
  } catch (error) {
    console.error("Error in getMembers:", error);
    next(error);
  }
};

/**
 * Thống kê thành viên theo tiêu chí (UC-GT06)
 */
exports.statsMembers = async (req, res, next) => {
  try {
    const groupField = req.query.groupBy || "gender";
    const stats = await FamilyMember.aggregate([
      { $group: { _id: `$${groupField}`, count: { $sum: 1 } } },
    ]);
    res.json({ stats });
  } catch (error) {
    console.error("Error in statsMembers:", error);
    next(error);
  }
};

const FamilyMember = require('../models/FamilyMember');

/**
 * Tạo mới thành viên (UC-GT01 & UC-GT02)
 */
exports.createMember = async (req, res, next) => {
  try {
    const { name, birthDate, gender, placeOfBirth, additionalInfo, role, parentId } = req.body;
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
    });
    await newMember.save();
    res.status(201).json({ message: "Thành viên được tạo thành công", member: newMember });
  } catch (error) {
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
    next(error);
  }
};

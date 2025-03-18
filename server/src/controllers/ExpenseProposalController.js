// server/src/controllers/ExpenseProposalController.js
const ExpenseProposal = require('../models/ExpenseProposal');

exports.getExpenseProposals = async (req, res, next) => {
  try {
    const proposals = await ExpenseProposal.find();
    res.json({ proposals });
  } catch (error) {
    console.error("Error in getExpenseProposals:", error);
    next(error);
  }
};

exports.updateExpenseProposal = async (req, res, next) => {
  try {
    const proposalId = req.params.id;
    const { status, notes } = req.body;
    const updatedProposal = await ExpenseProposal.findByIdAndUpdate(
      proposalId,
      { status, notes },
      { new: true }
    );
    if (!updatedProposal) {
      return res.status(404).json({ message: 'Đề xuất chi tiêu không tồn tại' });
    }
    res.json({ message: 'Cập nhật trạng thái đề xuất thành công', proposal: updatedProposal });
  } catch (error) {
    console.error("Error in updateExpenseProposal:", error);
    next(error);
  }
};

// server/src/controllers/TransactionController.js
const Transaction = require('../models/Transaction');

exports.getIncomeStats = async (req, res, next) => {
  try {
    const { groupBy } = req.query;
    let pipeline;

    // Khi nhóm theo contributor, thay vì nhóm theo ObjectId, ta nhóm theo tên của thành viên 
    if (!groupBy || groupBy === 'contributor') {
      pipeline = [
        { $match: { type: { $in: ['income', 'voluntary', 'donation'] } } },
        { 
          $lookup: {
            from: 'familymembers', // tên collection FamilyMember (chú ý: tên collection thường là số nhiều của model)
            localField: 'contributor',
            foreignField: '_id',
            as: 'contributorInfo'
          }
        },
        { $unwind: '$contributorInfo' },
        { 
          $group: {
            _id: '$contributorInfo.name', // nhóm theo tên thành viên
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ];
    } else if (groupBy === 'month') {
      pipeline = [
        { $match: { type: { $in: ['income', 'voluntary', 'donation'] } } },
        { $addFields: { month: { $month: "$date" } } },
        { 
          $group: {
            _id: "$month",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ];
    } else if (groupBy === 'type') {
      pipeline = [
        { $match: { type: { $in: ['income', 'voluntary', 'donation'] } } },
        { 
          $group: {
            _id: "$type",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ];
    } else {
      // Nếu groupBy không được hỗ trợ, sử dụng mặc định
      pipeline = [
        { $match: { type: { $in: ['income', 'voluntary', 'donation'] } } },
        { 
          $group: {
            _id: "$contributor",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ];
    }

    const stats = await Transaction.aggregate(pipeline);
    res.json({ stats });
  } catch (error) {
    console.error("Error in getIncomeStats:", error);
    next(error);
  }
};

exports.getExpenseStats = async (req, res, next) => {
  // Tương tự, xử lý thống kê cho các khoản chi
  try {
    const { groupBy } = req.query;
    const field = groupBy || 'responsiblePerson';
    const pipeline = [
      { $match: { type: 'expense' } },
      { 
        $group: {
          _id: `$${field}`,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ];
    const stats = await Transaction.aggregate(pipeline);
    res.json({ stats });
  } catch (error) {
    console.error("Error in getExpenseStats:", error);
    next(error);
  }
};

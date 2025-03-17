// server/src/models/UserAccount.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userAccountSchema = new Schema({
  familyMemberId: {
    type: Schema.Types.ObjectId,
    ref: 'FamilyMember',
    required: false // Có thể tạo tài khoản mà chưa liên kết với FamilyMember ngay lúc đăng ký
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true // Mật khẩu đã được mã hóa trước khi lưu
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    required: true // Ví dụ: "Hội đồng gia tộc", "Hội đồng tài chính", "Thành viên dòng họ"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserAccount', userAccountSchema);

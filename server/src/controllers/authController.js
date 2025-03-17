// server/src/controllers/authController.js
const UserAccount = require('../models/UserAccount');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

/**
 * Đăng ký người dùng mới
 */
exports.register = async (req, res, next) => {
  try {
    const { username, password, email, role } = req.body;

    // Kiểm tra xem username đã tồn tại chưa
    const existingUser = await UserAccount.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username đã tồn tại" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo mới tài khoản
    const user = new UserAccount({
      username,
      password: hashedPassword,
      email,
      role,
    });

    await user.save();
    res.status(201).json({ message: "Đăng ký thành công", user });
  } catch (error) {
    next(error);
  }
};

/**
 * Đăng nhập người dùng
 */
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UserAccount.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Thông tin đăng nhập không chính xác" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Thông tin đăng nhập không chính xác" });
    }
    // Tạo token JWT chứa thông tin người dùng
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      jwtSecret,
      { expiresIn: '1h' }
    );
    res.json({ message: "Đăng nhập thành công", token });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy danh sách tất cả tài khoản (dành cho admin)
 */
exports.getAccounts = async (req, res, next) => {
  try {
    // Bạn có thể thêm kiểm tra quyền admin ở đây nếu cần, ví dụ:
    // if (req.user.role !== 'Admin') return res.status(403).json({ message: "Không đủ quyền" });
    const accounts = await UserAccount.find().select('-password'); // Ẩn mật khẩu
    res.json({ accounts });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật thông tin tài khoản (chỉ admin hoặc người dùng tự cập nhật)
 */
exports.updateAccount = async (req, res, next) => {
  try {
    const accountId = req.params.id;
    const updateData = req.body;
    // Không cho phép cập nhật username nếu quy định
    const account = await UserAccount.findByIdAndUpdate(accountId, updateData, { new: true });
    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }
    res.json({ message: "Cập nhật tài khoản thành công", account });
  } catch (error) {
    next(error);
  }
};

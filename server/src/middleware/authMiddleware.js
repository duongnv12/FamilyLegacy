// server/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

const authMiddleware = (req, res, next) => {
  // Lấy header Authorization (expected format: "Bearer <token>")
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: "Không có token, truy cập bị từ chối" });
  }
  
  // Tách token ra khỏi header
  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
  
  const token = parts[1];

  try {
    // Xác thực token
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Token không hợp lệ" });
  }
};

module.exports = authMiddleware;

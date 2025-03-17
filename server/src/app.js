// server/src/app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const chalk = require('chalk');
const { mongoURI } = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const familyRoutes = require('./routes/familyRoutes'); // Thêm vào đây
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware bảo mật và xử lý request JSON
app.use(helmet());
app.use(cors());
app.use(express.json());

// Kết nối đến MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(chalk.green.bold('🟢 MongoDB connected successfully.')))
  .catch((err) => console.error(chalk.red.bold('MongoDB connection error:'), err));

// Định nghĩa các route
app.use('/api/auth', authRoutes);
app.use('/api/family', familyRoutes);
// Các route khác nếu cần

// Middleware xử lý lỗi
app.use(errorHandler);

module.exports = app;

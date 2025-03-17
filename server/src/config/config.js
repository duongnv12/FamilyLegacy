// server/src/config/config.js
require('dotenv').config();
const chalk = require('chalk');

const config = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET
};

// In ra các thông tin cấu hình (chỉ in những dữ liệu không nhạy cảm)
console.log(chalk.green.bold('Configuration loaded:'));
console.log(chalk.blue.bold(` - Port: ${config.port}`));
console.log(chalk.blue.bold(` - MongoDB URI: ${config.mongoURI}`));

module.exports = config;

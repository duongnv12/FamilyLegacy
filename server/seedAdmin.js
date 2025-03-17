// server/seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserAccount = require('./src/models/UserAccount');
const { mongoURI } = require('./src/config/config');

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB for seeding admin...');

    const adminData = {
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('AdminPassword123!', 10),
      role: 'Admin',
    };

    // Kiểm tra xem tài khoản admin có tồn tại chưa:
    const existingAdmin = await UserAccount.findOne({ username: adminData.username });
    if (existingAdmin) {
      console.log('Tài khoản admin đã tồn tại.');
    } else {
      await new UserAccount(adminData).save();
      console.log('Tài khoản admin đã được tạo thành công.');
    }
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Lỗi kết nối MongoDB:', err);
    mongoose.connection.close();
  });

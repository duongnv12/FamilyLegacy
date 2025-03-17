// server/seedFounder.js
const mongoose = require('mongoose');
const FamilyMember = require('./src/models/FamilyMember');
const { mongoURI } = require('./src/config/config');
const chalk = require('chalk');

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log(chalk.green.bold('Connected to MongoDB for seeding Founder...'));

    const founderData = {
      name: 'Ông Tổ',
      birthDate: new Date('1920-01-01'),
      gender: 'Male',  // Thay đổi theo yêu cầu
      placeOfBirth: 'Quê hương',
      status: 'Sống',
      role: 'Founder',
      additionalInfo: 'Người sáng lập dòng họ FamilyLegacy',
      parentId: null,
    };

    const existingFounder = await FamilyMember.findOne({ role: 'Founder' });
    if (existingFounder) {
      console.log(chalk.yellow.bold('Founder đã tồn tại.'));
    } else {
      await new FamilyMember(founderData).save();
      console.log(chalk.green.bold('Founder được tạo thành công.'));
    }
    mongoose.connection.close();
  })
  .catch(err => {
    console.error(chalk.red.bold('Lỗi kết nối MongoDB:'), err);
    mongoose.connection.close();
  });

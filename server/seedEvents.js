const mongoose = require('mongoose');
const Event = require('./src/models/Event');
const { mongoURI } = require('./src/config/config');
const chalk = require('chalk');

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log(chalk.green.bold('Connected to MongoDB for seeding events...'));
    
    const events = [
      { name: 'Sự kiện thường niên', date: new Date('2023-09-15'), location: 'Hà Nội', description: 'Sự kiện hội tụ các thành viên gia phả' },
      { name: 'Hội nghị gia phả', date: new Date('2023-11-20'), location: 'TP. Hồ Chí Minh', description: 'Thông tin hội nghị' },
      { name: 'Lễ kỷ niệm kính cựu', date: new Date('2023-12-05'), location: 'Đà Nẵng', description: 'Kỷ niệm những đóng góp xuất sắc' },
      { name: 'Hội thảo văn hóa', date: new Date('2023-12-25'), location: 'Nha Trang', description: 'Hội thảo văn hóa' },
      { name: 'Giỗ Họ', date: new Date('2023-10-10'), location: 'Hà Nội', description: 'Giỗ tổ tiên' },
      { name: 'Cải tạo nhà thờ', date: new Date('2023-11-10'), location: 'Hà Nội', description: 'Cải tạo nhà thờ' },    
    ];
    
    await Event.insertMany(events);
    console.log(chalk.green.bold('Events seeded successfully.'));
    mongoose.connection.close();
  })
  .catch(err => {
    console.error(chalk.red.bold('MongoDB connection error:'), err);
    mongoose.connection.close();
  });

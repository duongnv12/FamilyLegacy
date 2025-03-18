const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const chalk = require('chalk');
const { mongoURI } = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const familyRoutes = require('./routes/familyRoutes');
const financialRoutes = require('./routes/financialRoutes');
const eventRoutes = require('./routes/eventRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(chalk.green.bold('🟢 MongoDB connected successfully.')))
  .catch((err) => console.error(chalk.red.bold('MongoDB connection error:'), err));

app.use('/api/auth', authRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/events', eventRoutes);

app.use(errorHandler);

module.exports = app;

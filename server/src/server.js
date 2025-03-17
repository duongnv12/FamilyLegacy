// server/src/server.js
const app = require('./app');
const { port } = require('./config/config');
const chalk = require('chalk');

app.listen(port, () => {
  console.log(chalk.green.bold(`🟢 Server is running on port ${port}`));
});

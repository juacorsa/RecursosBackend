require('express-async-errors');
const winston = require('winston');

module.exports = function() {
  winston.handleExceptions(
    new winston.transports.File({ filename: 'errores.log' }));
  
  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  winston.add(winston.transports.File, { filename: 'recursos.log' });
}
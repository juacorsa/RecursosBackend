const express = require('express');
const winston = require('winston');
const app = express();

require('./boot/config')();
require('./boot/routes')(app);
require('./boot/db')();
require('./boot/logging')();
require('./boot/validation')();

const port = process.env.PORT || 3000;
app.listen(port, () => { 
	winston.info(`Servidor escuchando en puerto ${port} ...`)
});
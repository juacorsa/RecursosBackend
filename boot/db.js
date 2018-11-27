const mongoose = require('mongoose');
const winston  = require('winston');

const user = process.env.DB_USER;
const database = process.env.DB_NAME;
const password = process.env.DB_PASS;

module.exports = function() {
	mongoose.connect(`mongodb://${user}:${password}@ds153763.mlab.com:53763/${database}`, { useNewUrlParser: true })
	.then(() => winston.info('Conectado a MongoDB...'))
	.catch((err) => {
		winston.error('Ha sido imposible conectar con MongoDB...', err);
		process.exit(1);
	});	
}

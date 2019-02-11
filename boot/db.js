const mongoose = require('mongoose');
const winston  = require('winston');

const user = process.env.DB_USER;
const database = process.env.DB_NAME;
const password = process.env.DB_PASS;

module.exports = function() {
	const url_db = `mongodb://${user}:${password}@ds153763.mlab.com:53763/${database}`;
	const url_db_test = 'mongodb://localhost:27017/recursos_test';

	mongoose.connect(url_db, { useNewUrlParser: true })
	.then(() => winston.info('Conectado a MongoDB...'))
	.catch((err) => {
		winston.error('Ha sido imposible conectar con MongoDB...', err);
		process.exit(1);
	});	
}

const mongoose = require('mongoose');
const Joi = require('joi');

const idiomaSchema = new mongoose.Schema({  
  nombre: { type: String, required: true, trim: true, maxlength: 25 }
});

function validar(idioma) {
	const schema = {
		nombre: Joi.string().max(25).required()
	};

	return Joi.validate(idioma, schema);
}

const Idioma = mongoose.model('Idioma', idiomaSchema, 'idiomas');

exports.Idioma = Idioma;
exports.validar = validar;
exports.idiomaSchema = idiomaSchema;
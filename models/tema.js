const mongoose = require('mongoose');
const Joi = require('joi');

const temaSchema = new mongoose.Schema({  
  nombre: { type: String, required: true, trim: true, maxlength: 50 }
});

function validar(tema) {
	const schema = {
		nombre: Joi.string().max(50).required()
	};

	return Joi.validate(tema, schema);
};

const Tema = mongoose.model('Tema', temaSchema, 'temas');

exports.Tema = Tema;
exports.validar = validar;
exports.temaSchema = temaSchema;
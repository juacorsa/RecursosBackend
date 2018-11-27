const mongoose = require('mongoose');
const Joi = require('joi');

const valoracionSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, maxlength: 50 }
});

function validar(valoracion) {
	const schema = {
		nombre: Joi.string().max(50).required()
	};

	return Joi.validate(valoracion, schema);
};

const Valoracion = mongoose.model('Valoracion', valoracionSchema, 'valoraciones');

exports.Valoracion = Valoracion;
exports.validar = validar;
exports.valoracionSchema = valoracionSchema;
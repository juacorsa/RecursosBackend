const mongoose = require('mongoose');
const Joi = require('joi');

const fabricanteSchema = new mongoose.Schema({  
  nombre: { type: String, required: true, trim: true, maxlength: 50 }
});

function validar(fabricante) {
	const schema = {
		nombre: Joi.string().max(50).required()
	};

	return Joi.validate(fabricante, schema);
}

const Fabricante = mongoose.model('Fabricante', fabricanteSchema, 'fabricantes');

exports.Fabricante = Fabricante;
exports.validar = validar;
exports.fabricanteSchema = fabricanteSchema;
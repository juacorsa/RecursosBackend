const mongoose = require('mongoose');
const Joi = require('joi');
const temaSchema = require('./tema');
const valoracionSchema = require('./valoracion');

const Enlace = mongoose.model('Enlace', new mongoose.Schema({
	titulo: { type: String, required: true, trim: true },
	url: { type: String, required: true, trim: true },
	tema: { type: temaSchema, required: true },
	valoracion: { type: valoracionSchema, required: true },
	registrado : { type: Date, default: Date.now }
},
{
  collection: 'enlaces'
}));

function validar(enlace) {
	const schema = {
		titulo: Joi.string().required(),
		url: Joi.string().required(),
		temaId: Joi.objectId().required(),
		valoracionId: Joi.objectId().required()		
	};

	return Joi.validate(enlace, schema);
}

exports.Enlace  = Enlace;
exports.validar = validar;
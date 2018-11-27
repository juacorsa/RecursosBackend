const mongoose = require('mongoose');
const Joi = require('joi');
const temaSchema = require('./tema');
const valoracionSchema = require('./valoracion');
const idiomaSchema = require('./idioma');
const fabricanteSchema = require('./fabricante');

const Tutorial = mongoose.model('Tutorial', new mongoose.Schema({
	titulo: { type: String, required: true, trim: true },
	duracion: { type: Number, required: true },
	publicado: { type: Number, required: true },
	tema: { type: temaSchema, required: true },
	valoracion: { type: valoracionSchema, required: true },
	fabricante: { type: fabricanteSchema, required: true },
	idioma: { type: idiomaSchema, required: true },
	registrado : { type: Date, default: Date.now }
},
{
  collection: 'tutoriales'
}));

function validar(tutorial) {
	const schema = {
		titulo: Joi.string().required(),
		publicado: Joi.number().integer().required(),
		horas  : Joi.number().min(0).required(),	
		minutos: Joi.number().min(0).max(59).required(),	
		temaId : Joi.objectId().required(),
		valoracionId: Joi.objectId().required(),
		fabricanteId : Joi.objectId().required(),
		idiomaId: Joi.objectId().required()
	};

	return Joi.validate(tutorial, schema);
}

exports.Tutorial = Tutorial;
exports.validar = validar;
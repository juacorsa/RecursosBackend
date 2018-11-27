const mongoose = require('mongoose');
const Joi = require('joi');
const temaSchema = require('./tema');
const valoracionSchema = require('./valoracion');
const idiomaSchema = require('./idioma');
const editorialSchema = require('./editorial');

const Libro = mongoose.model('Libro', new mongoose.Schema({
	titulo: { type: String, required: true, trim: true },
	publicado: { type: Number, required: true },
	paginas: { type: Number, required: true },
	tema: { type: temaSchema, required: true },
	valoracion: { type: valoracionSchema, required: true },
	editorial: { type: editorialSchema, required: true },
	idioma: { type: idiomaSchema, required: true },
	registrado : { type: Date, default: Date.now }
},
{
  collection: 'libros'
}));

function validar(libro) {
	const schema = {
		titulo: Joi.string().required(),
		publicado: Joi.number().required(),
		paginas: Joi.number().required(),
		temaId: Joi.objectId().required(),
		valoracionId: Joi.objectId().required(),
		editorialId: Joi.objectId().required(),
		idiomaId: Joi.objectId().required()
	};

	return Joi.validate(libro, schema);
}

exports.Libro = Libro;
exports.validar = validar;
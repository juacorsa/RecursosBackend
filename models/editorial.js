const mongoose = require('mongoose');
const Joi = require('joi');

const editorialSchema = new mongoose.Schema({  
  nombre: { type: String, required: true, trim: true, maxlength: 50 }
});

function validar(editorial) {
	const schema = {
		nombre: Joi.string().max(50).required()
	};

	return Joi.validate(editorial, schema);
}

const Editorial = mongoose.model('Editorial', editorialSchema, 'editoriales');

exports.Editorial = Editorial;
exports.validar = validar;
exports.editorialSchema = editorialSchema;
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const editoriales = require('../routes/editoriales');
const temas = require('../routes/temas');
const idiomas = require('../routes/idiomas');
const fabricantes = require('../routes/fabricantes');
const valoraciones = require('../routes/valoraciones');
const enlaces = require('../routes/enlaces');
const libros = require('../routes/libros');
const tutoriales = require('../routes/tutoriales');
const error = require('../middleware/error');

module.exports = function(app) {
	app.use(express.json());
	app.use(helmet());
	app.use('/api/editoriales', editoriales);
	app.use('/api/temas', temas);
	app.use('/api/idiomas', idiomas);
	app.use('/api/fabricantes', fabricantes);
	app.use('/api/valoraciones', valoraciones);	
	app.use('/api/enlaces', enlaces);	
	app.use('/api/libros', libros);	
	app.use('/api/tutoriales', tutoriales);	
	app.use(error);
}
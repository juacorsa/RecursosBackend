const request = require('supertest');
const mongoose = require('mongoose');
const {Idioma} = require('../models/idioma');
const {Tema}   = require('../models/tema');
const {Valoracion} = require('../models/valoracion');
const {Editorial}  = require('../models/editorial');
const {Libro} = require('../models/libro');
const util = require('../util');

let server;

describe('/api/libros', () => {
	let tema;
	let valoracion;
	let editorial;
	let idioma;


	
});
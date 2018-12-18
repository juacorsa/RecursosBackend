const request = require('supertest');
const mongoose = require('mongoose');
const {Idioma} = require('../models/idioma');
const {Tema}   = require('../models/tema');
const {Valoracion} = require('../models/valoracion');
const {Fabricante}  = require('../models/fabricante');
const {Tutorial} = require('../models/tutorial');
const util = require('../util');

let server;

describe('/api/tutoriales', () => {
	let tema;
	let valoracion;
	let fabricante;
	let idioma;
	let publicado;
	let minutos;
	let horas;

	beforeEach(() => { 
		tema = mongoose.Types.ObjectId();
		valoracion = mongoose.Types.ObjectId();
		fabricante = mongoose.Types.ObjectId();
		idioma = mongoose.Types.ObjectId();
	    publicado = util.obtenerAñoActual();
		horas     = util.obtenerEnteroAleatorio(1, 100);
		minutos   = util.obtenerEnteroAleatorio(1, 59);
		server = require('../server'); });

	afterEach(async ()  => { 
		server.close(); 
		await Tutorial.deleteMany({});
	});

	describe('GET /', () => {
		it('devuelve todos los tutoriales', async () => {
			Tutorial.collection.insertMany([
				{ titulo: 'titulo1', publicado, horas, minutos, tema, valoracion, fabricante, idioma },
				{ titulo: 'titulo2', publicado, horas, minutos, tema, valoracion, fabricante, idioma }
			]);

			const res = await request(server).get('/api/tutoriales');

			expect(res.status).toBe(200);			
			expect(res.body.some(e => e.titulo === 'titulo1')).toBeTruthy();
			expect(res.body.some(e => e.titulo === 'titulo2')).toBeTruthy();
		});
	});

	describe('GET /:id', () => {
		it('devuelve un tutorial si le pasamos un id válido', async () => {
			const duracion = util.obtenerEnteroAleatorio(1, 5000);
			
			const tutorial = new Tutorial({ titulo: 'titulo1', publicado, duracion,
				tema, valoracion, fabricante, idioma });

			await tutorial.save();			

			const res = await request(server).get('/api/tutoriales/' + tutorial._id);

			expect(tutorial).not.toBeNull();	
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const res = await request(server).get('/api/tutoriales/1');

			expect(res.status).toBe(404);
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const id  = mongoose.Types.ObjectId();
			const res = await request(server).get('/api/tutoriales/' + id);

			expect(res.status).toBe(404);
		});
	});



	
});
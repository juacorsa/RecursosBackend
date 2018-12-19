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

		it('devuelve un error 404 si le pasamos un id inexistente', async () => {
			const id  = mongoose.Types.ObjectId();
			const res = await request(server).get('/api/tutoriales/' + id);

			expect(res.status).toBe(404);
		});
	});

	describe('POST /', () => {
		let titulo;
		let publicado;
		let horas;
		let minutos;
		let tema;
		let fabricante;
		let idioma;
		let valoracion;

		const exec = async () => {
			return await request(server)
		        .post('/api/tutoriales/')
		        .send({ titulo, publicado, horas, minutos, tema, valoracion, fabricante, idioma });
		}		

		beforeEach(() => {      		
      		titulo = 'titulo1'; 
      		publicado = util.obtenerAñoActual();
      		horas     = util.obtenerEnteroAleatorio(1, 500);
      		minutos   = util.obtenerEnteroAleatorio(1, 59);
    	})

		it('devuelve un error 400 si el título del tutorial es vacío', async () => {
			titulo = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita el año publicación del tutorial', async () => {
			publicado = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita las horas del tutorial', async () => {
			horas = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita los minutos del tutorial', async () => {
			minutos = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita el tema del tutorial', async () => {
			temaId = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita el fabricante del tutorial', async () => {
			fabricanteId = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita el idioma del tutorial', async () => {
			idiomaId = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita la valoración del tutorial', async () => {
			valoracionId = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si las horas es un valor negativo', async () => {
			horas = -1;

			const res = await exec();
			
			expect(res.status).toBe(400);
		});				

		it('devuelve un error 400 si los minutos es un valor negativo', async () => {
			minutos = -1;

			const res = await exec();
			
			expect(res.status).toBe(400);
		});				

		it('devuelve un error 400 si el año de la publicación del tutorial es superior al año en curso', async () => {		
			publicado = util.obtenerAñoActual() + 1;

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si el año de la publicación del tutorial es negativa', async () => {		
			publicado = -1 * util.obtenerEnteroAleatorio(2000, 2030)

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

	    it('devuelve un tutorial si es válido', async () => {	
	    	const tema = new Tema({ nombre: 'tema' });
			await tema.save();			

	    	const valoracion = new Valoracion({ nombre: 'valoracion' });
	    	await valoracion.save();	    	

	    	const fabricante = new Fabricante({ nombre: 'fabricante' });
	    	await fabricante.save();	    	

	    	const idioma = new Idioma({ nombre: 'idioma' });
	    	await idioma.save();
	    	
			await exec();

	      	const tutorial = await Tutorial.find({ titulo: 'titulo1' });

	      	expect(tutorial).not.toBeNull();	      	
	    });
	});

	describe('PUT /', () => {
		let titulo;
		let publicado;
		let horas;
		let minutos;
		let tema;
		let fabricante;
		let idioma;
		let valoracion;
		let id;
		let duracion;

		const exec = async () => {
			return await request(server)
		        .put('/api/tutoriales/' + id)
		        .send({ titulo, publicado, horas, minutos, tema, valoracion, fabricante, idioma });
		}		

		beforeEach(async () => {      		
      		titulo    = 'titulo1'; 
      		publicado = util.obtenerAñoActual();
      		horas     = util.obtenerEnteroAleatorio(1, 500);
      		minutos   = util.obtenerEnteroAleatorio(1, 59);
      		duracion  = util.obtenerEnteroAleatorio(1, 1000);

	    	const tema = new Tema({ nombre: 'tema1' });
			await tema.save();			

	    	const valoracion = new Valoracion({ nombre: 'valoracion1' });
	    	await valoracion.save();
	    	
	    	const fabricante = new Fabricante({ nombre: 'fabricante' });
	    	await fabricante.save();	    	

	    	const idioma = new Idioma({ nombre: 'idioma' });
	    	await idioma.save();

        	tutorial = new Tutorial({ titulo, publicado, duracion, tema, valoracion, fabricante, idioma });
      		await tutorial.save();      
      
      		id = tutorial._id; 	    		
    	})

		it('devuelve un error 400 si el título del tutorial es vacío', async () => {
			titulo = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita el año publicación del tutorial', async () => {
			publicado = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita la duracion del tutorial', async () => {
			duracion = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita el tema del tutorial', async () => {
			temaId = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita el fabricante del tutorial', async () => {
			fabricanteId = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita el idioma del tutorial', async () => {
			idiomaId = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita la valoración del tutorial', async () => {
			valoracionId = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si el año de la publicación del tutorial es superior al año en curso', async () => {		
			publicado = util.obtenerAñoActual() + 1;

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si el año de la publicación del tutorial es negativa', async () => {		
			publicado = -1 * util.obtenerEnteroAleatorio(2000, 2030)

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

	    it('devuelve un tutorial si es válido', async () => {	
	    	const tema = new Tema({ nombre: 'tema' });
			await tema.save();			

	    	const valoracion = new Valoracion({ nombre: 'valoracion' });
	    	await valoracion.save();	    	

	    	const fabricante = new Fabricante({ nombre: 'fabricante' });
	    	await fabricante.save();	    	

	    	const idioma = new Idioma({ nombre: 'idioma' });
	    	await idioma.save();
	    	
	    	titulo = 'titulo2';

			await exec();			

	      	const tutorial = await Tutorial.find({ titulo: 'titulo2' });

	      	expect(tutorial).not.toBeNull();	      	
	    });
	});


	describe('DELETE /', () => {
		let titulo;
		let publicado;
		let paginas;
		let tema;
		let editorial;
		let idioma;
		let valoracion;
		let id;

	    const exec = async () => {
	      return await request(server)
	        .delete('/api/tutoriales/' + id)
	        .send();
	    }

		beforeEach(async () => {      		
      		titulo    = 'titulo1'; 
      		publicado = util.obtenerAñoActual();
      		horas     = util.obtenerEnteroAleatorio(1, 500);
      		minutos   = util.obtenerEnteroAleatorio(1, 59);
      		duracion  = util.obtenerEnteroAleatorio(1, 1000);

	    	const tema = new Tema({ nombre: 'tema1' });
			await tema.save();			

	    	const valoracion = new Valoracion({ nombre: 'valoracion1' });
	    	await valoracion.save();
	    	
	    	const fabricante = new Fabricante({ nombre: 'fabricante' });
	    	await fabricante.save();	    	

	    	const idioma = new Idioma({ nombre: 'idioma' });
	    	await idioma.save();

        	tutorial = new Tutorial({ titulo, publicado, duracion, tema, valoracion, fabricante, idioma });
      		await tutorial.save();      
      
      		id = tutorial._id; 	    		
    	})

	    it('devuelve un error 404 si el id no es válido', async () => {
	      id = 1; 
	      
	      const res = await exec();

	      expect(res.status).toBe(404);
	    });

	    it('devuelve un error 404 si no se encuentra el id especificado', async () => {
	      id = mongoose.Types.ObjectId();

	      const res = await exec();

	      expect(res.status).toBe(404);
	    });

	    it('debe borrar el tutorial', async () => {
	      await exec();

	      const tutorial = await Tutorial.findById(id);

	      expect(tutorial).toBeNull();
	    });

	    it('devuelve el tutorial borrado', async () => {
	      const res = await exec();

	      expect(res.body).toHaveProperty('_id');
	      expect(res.body).toHaveProperty('titulo');
	      expect(res.body).toHaveProperty('duracion');
	      expect(res.body).toHaveProperty('tema');
	      expect(res.body).toHaveProperty('idioma');
	      expect(res.body).toHaveProperty('valoracion');
	      expect(res.body).toHaveProperty('fabricante');
	    });   
	});
});

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

	beforeEach(() => { 
		tema = mongoose.Types.ObjectId();
		valoracion = mongoose.Types.ObjectId();
		editorial  = mongoose.Types.ObjectId();
		idioma = mongoose.Types.ObjectId();
		server = require('../server'); });

	afterEach(async ()  => { 
		server.close(); 
		await Libro.deleteMany({});
	});

	describe('GET /', () => {
		it('devuelve todos los libros', async () => {
			const publicado = util.obtenerAñoActual();
			const paginas = util.obtenerEnteroAleatorio(1, 1000);

			Libro.collection.insertMany([
				{ titulo: 'titulo1', publicado, paginas, tema, valoracion, editorial, idioma },
				{ titulo: 'titulo2', publicado, paginas, tema, valoracion, editorial, idioma }
			]);

			const res = await request(server).get('/api/libros');

			expect(res.status).toBe(200);			
			expect(res.body.some(e => e.titulo === 'titulo1')).toBeTruthy();
			expect(res.body.some(e => e.titulo === 'titulo2')).toBeTruthy();
		});
	});

	describe('GET /:id', () => {
		it('devuelve un libro si le pasamos un id válido', async () => {
			const libro = new Libro({ titulo: 'titulo1', publicado: 2018, paginas: 10, 
				tema, valoracion, editorial, idioma });

			await libro.save();			

			const res = await request(server).get('/api/libros/' + libro._id);

			expect(libro).not.toBeNull();	
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const res = await request(server).get('/api/libros/1');

			expect(res.status).toBe(404);
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const id  = mongoose.Types.ObjectId();
			const res = await request(server).get('/api/libros/' + id);

			expect(res.status).toBe(404);
		});
	});

	describe('POST /', () => {
		let titulo;
		let publicado;
		let paginas;
		let tema;
		let editorial;
		let idioma;
		let valoracion;

		const exec = async () => {
			return await request(server)
		        .post('/api/libros/')
		        .send({ titulo, publicado, paginas, tema, valoracion, editorial, idioma });
		}		

		beforeEach(() => {      		
      		titulo = 'titulo1'; 
      		publicado = util.obtenerAñoActual();
      		paginas   = util.obtenerEnteroAleatorio(1, 500);
    	})

		it('devuelve un error 400 si el título del libro es vacío', async () => {
			titulo = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita el año publicación del libro', async () => {
			publicado = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita las páginas del libro', async () => {
			paginas = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita el tema del libro', async () => {
			temaId = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita la valoración del libro', async () => {
			valoracionId = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita el idioma del libro', async () => {
			idiomaId = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si las páginas del libro es un valor negativo', async () => {
			paginas = -1;

			const res = await exec();
			
			expect(res.status).toBe(400);
		});				

		it('devuelve un error 400 si no se facilita la editorial del libro', async () => {
			editorialId = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si el año de la publicación del libro es superior al año en curso', async () => {		
			publicado = util.obtenerAñoActual() + 1;

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

	    it('devuelve un libro si es válido', async () => {	
	    	const tema = new Tema({ nombre: 'tema' });
			await tema.save();			

	    	const valoracion = new Valoracion({ nombre: 'valoracion' });
	    	await valoracion.save();	    	

	    	const editorial = new Editorial({ nombre: 'editorial' });
	    	await editorial.save();	    	

	    	const idioma = new Idioma({ nombre: 'idioma' });
	    	await idioma.save();
	    	
			await exec();

	      	const libro = await Libro.find({ titulo: 'titulo1' });

	      	expect(libro).not.toBeNull();	      	
	    });
	});

	describe('PUT /:id', () => {
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
		        .put('/api/libros/' + id)
		        .send({ titulo, publicado, paginas, tema, valoracion, editorial, idioma });
		}		

    	beforeEach(async () => {     
    		nuevoTitulo = 'titulo2';
	    	publicado   = util.obtenerAñoActual();
	    	paginas 	= util.obtenerEnteroAleatorio(1, 500);

	    	const tema = new Tema({ nombre: 'tema1' });
			await tema.save();			

	    	const valoracion = new Valoracion({ nombre: 'valoracion1' });
	    	await valoracion.save();
	    	
	    	const editorial = new Editorial({ nombre: 'editorial' });
	    	await editorial.save();	    	

	    	const idioma = new Idioma({ nombre: 'idioma' });
	    	await idioma.save();

        	libro = new Libro({ 'titulo': 'titulo1', publicado, paginas, tema, valoracion, editorial, idioma });
      		await libro.save();      
      
      		id = libro._id; 	    		
    	});

		it('devuelve un error 400 si el título del libro es vacío', async () => {
			titulo = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita el año publicación del libro', async () => {
			publicado = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita las páginas del libro', async () => {
			paginas = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si las páginas del libro es un valor negativo', async () => {
			paginas = -1;

			const res = await exec();
			
			expect(res.status).toBe(400);
		});		

		it('devuelve un error 400 si no se facilita el tema del libro', async () => {
			tema = null;

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita la valoración del libro', async () => {
			valoracion = null;

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita el idioma del libro', async () => {
			idioma = null;

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si no se facilita la editorial del libro', async () => {
			editorial = null;

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si el año de la publicación del libro es superior al año en curso', async () => {			
			publicado = util.obtenerAñoActual() + 1;

			const res = await exec();
			
			expect(res.status).toBe(400);
		});		

	    it('devuelve un libro si es válido', async () => {	
	    	const tema = new Tema({ nombre: 'tema' });
			await tema.save();			

	    	const valoracion = new Valoracion({ nombre: 'valoracion' });
	    	await valoracion.save();	    	

	    	const editorial = new Editorial({ nombre: 'editorial' });
	    	await editorial.save();	    	

	    	const idioma = new Idioma({ nombre: 'idioma' });
	    	await idioma.save();
	    	
			await exec();

	      	const libro = await Libro.find({ titulo: nuevoTitulo });

	      	expect(libro).not.toBeNull();	      	
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
	        .delete('/api/libros/' + id)
	        .send();
	    }

    	beforeEach(async () => {     
    		nuevoTitulo = 'titulo2';
	    	publicado   = util.obtenerAñoActual();
	    	paginas = util.obtenerEnteroAleatorio(1, 500);

	    	const tema = new Tema({ nombre: 'tema1' });
			await tema.save();
			temaId = tema._id;

	    	const valoracion = new Valoracion({ nombre: 'valoracion1' });
	    	await valoracion.save();
	    	valoracionId = valoracion._id;

	    	const editorial = new Editorial({ nombre: 'editorial' });
	    	await editorial.save();	    	

	    	const idioma = new Idioma({ nombre: 'idioma' });
	    	await idioma.save();

        	libro = new Libro({ 'titulo': 'titulo1', publicado, paginas, tema, valoracion, editorial, idioma });
      		await libro.save();      
      
      		id = libro._id; 	    		
    	});

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

	    it('debe borrar el libro', async () => {
	      await exec();

	      const libro = await Libro.findById(id);

	      expect(libro).toBeNull();
	    });

	    it('devuelve el libro borrado', async () => {
	      const res = await exec();

	      expect(res.body).toHaveProperty('_id');
	      expect(res.body).toHaveProperty('titulo');
	      expect(res.body).toHaveProperty('publicado');
	      expect(res.body).toHaveProperty('tema');
	      expect(res.body).toHaveProperty('editorial');
	      expect(res.body).toHaveProperty('valoracion');
	    });
	});
});
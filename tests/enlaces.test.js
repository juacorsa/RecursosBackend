const request = require('supertest');
const mongoose = require('mongoose');
const {Enlace} = require('../models/enlace');

const {Tema} = require('../models/tema');
const {Valoracion} = require('../models/valoracion');

let server;

describe('/api/enlaces', () => {
	beforeEach(() => { server = require('../server'); });
	afterEach(async ()  => { 
		server.close(); 
		await Enlace.deleteMany({});
	});

	describe('GET /', () => {
		it('devuelve todas los enlaces', async () => {		
			const temaId = mongoose.Types.ObjectId();
			const valoracionId = mongoose.Types.ObjectId();

			Enlace.collection.insertMany([
				{ titulo: 'enlace1', url: 'url1', temaId, valoracionId },
				{ titulo: 'enlace2', url: 'url2', temaId, valoracionId }
			]);

			const res = await request(server).get('/api/enlaces');

			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2);
			expect(res.body.some(e => e.titulo === 'enlace1')).toBeTruthy();
			expect(res.body.some(e => e.titulo === 'enlace2')).toBeTruthy();
		});
	});

	describe('GET /:id', () => {
		it('devuelve un enlace si le pasamos un id válido', async () => {
			const tema = mongoose.Types.ObjectId();
			const valoracion = mongoose.Types.ObjectId();

			const enlace = new Enlace({ titulo: 'enlace1', url: 'url1', tema, valoracion });
			await enlace.save();			

			const res = await request(server).get('/api/enlaces/' + enlace._id);

			expect(enlace).not.toBeNull();	
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const res = await request(server).get('/api/enlaces/1');

			expect(res.status).toBe(404);
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const id  = mongoose.Types.ObjectId();
			const res = await request(server).get('/api/enlaces/' + id);

			expect(res.status).toBe(404);
		});
	});	
	
	describe('POST /', () => {
		let titulo;
		let url;
		let tema;
		let valoracion;

		const exec = async () => {
			return await request(server)
		        .post('/api/enlaces/')
		        .send({ titulo, url, tema, valoracion });
		}		

		beforeEach(() => {      		
      		titulo = 'enlace1'; 
      		url    = 'url1';
      		tema   = mongoose.Types.ObjectId();
      		valoracion = mongoose.Types.ObjectId();
    	})

		it('devuelve un error 400 si el títuo del enlace es vacío', async () => {
			titulo = ';'

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si la url del enlace es vacía', async () => {
			url = ';'

			const res = await exec();
			
			expect(res.status).toBe(400);
		});	

		it('devuelve un error 400 si el tema del enlace es vacío', async () => {
			tema = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si la valoración del enlace es vacía', async () => {
			valoracion = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

	    it('devuelve un enlace si es válido', async () => {		
			const res = await exec();

	      	const enlace = await Enlace.find({ titulo: 'enlace1' });

	      	expect(enlace).not.toBeNull();	      	
	    });

	    it.skip('devuelve un valor 200 al registrar un enlace', async () => {
			const res = await exec();								      	
	      	
			expect(res.status).toBe(200);	      	
	    });

	});

	/*
	describe('PUT /', () => {
		let nuevoNombre;
		let id;
		let editorial;

    	const exec = async () => {
      		return await request(server)
        		.put('/api/enlaces/' + id)        
        		.send({ nombre: nuevoNombre });
    	}

    	beforeEach(async () => {     
        	editorial = new Editorial({ nombre: 'enlace1' });
      		await editorial.save();      
      
      		id = editorial._id; 	
      		nuevoNombre = 'editorialActualizada'; 
    	})

	    it('devuelve un error 400 if el nombre de la editorial es superior a 50 caracteres', async () => {
	    	nuevoNombre = new Array(52).join('a');
	      
	      	const res = await exec();

	      	expect(res.status).toBe(400);
	    });

	    it('devuelve un error 400 if el nombre de la editorial es vacío', async () => {
	    	nuevoNombre = '';
	      
	      	const res = await exec();

	      	expect(res.status).toBe(400);
	    });

	    it('devuelve un error 404 si el id no es válido', async () => {
	      id = 1;

	      const res = await exec();

	      expect(res.status).toBe(404);
	    });

	    it('devuelve un error 404 si el id de la editorial no es válido', async () => {
	      id = mongoose.Types.ObjectId();
	      nuevoNombre = new Array(10).join('a');

	      const res = await exec();

	      expect(res.status).toBe(404);
	    });

	    it('devuelve la editorial actualizada si la editorial es válida', async () => {
	      await exec();

	      const editorialActualizada = await Editorial.findById(editorial._id);

	      expect(editorialActualizada.nombre).toBe(nuevoNombre);
	    });

	    it('devuelve la editorial actualizada si la editorial es válida', async () => {
	      const res = await exec();

	      expect(res.body).toHaveProperty('_id');
	      expect(res.body).toHaveProperty('nombre', nuevoNombre);
	    });
	});*/
})
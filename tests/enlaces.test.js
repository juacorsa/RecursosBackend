const request  = require('supertest');
const mongoose = require('mongoose');
const {Enlace} = require('../models/enlace');
const {Tema}   = require('../models/tema');
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
		let temaId;
		let valoracionId;

		const exec = async () => {
			return await request(server)
		        .post('/api/enlaces/')
		        .send({ titulo, url, temaId, valoracionId });
		}		

		beforeEach(() => {      		
      		titulo = 'enlace1'; 
      		url    = 'url1';
    	})

		it('devuelve un error 400 si el título del enlace es vacío', async () => {
			titulo = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si la url del enlace es vacía', async () => {
			url = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});	

		it('devuelve un error 400 si el tema del enlace es vacío', async () => {
			temaId = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si la valoración del enlace es vacía', async () => {
			valoracionId = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

	    it('devuelve un enlace si es válido', async () => {	
	    	const tema = new Tema({ nombre: 'tema1' });
			await tema.save();
			temaId = tema._id;

	    	const valoracion = new Valoracion({ nombre: 'valoracion1' });
	    	await valoracion.save();
	    	valoracionId = valoracion._id;

			await exec();

	      	const enlace = await Enlace.find({ titulo: 'enlace1' });

	      	expect(enlace).not.toBeNull();	      	
	    });
	});
	
	describe('PUT /', () => {
		let nuevoTitulo;
		let nuevaUrl;
		let id;
		let enlace;
		let temaId;
		let valoracionId;

    	const exec = async () => {
      		return await request(server)
        		.put('/api/enlaces/' + id)        
        		.send({ 'titulo': nuevoTitulo, 'url': nuevaUrl, 'temaId': temaId, 'valoracionId': valoracionId });
    	}

    	beforeEach(async () => {     
    		nuevoTitulo = 'nuevoTitulo';
	    	nuevaUrl    = 'nuevaUrl';      		

	    	const tema = new Tema({ nombre: 'tema1' });
			await tema.save();
			temaId = tema._id;

	    	const valoracion = new Valoracion({ nombre: 'valoracion1' });
	    	await valoracion.save();
	    	valoracionId = valoracion._id;

        	enlace = new Enlace({ 'titulo': 'a', 'url': 'url1', 'temaId': temaId, 'valoracionId': valoracionId });
      		await enlace.save();      
      
      		id = enlace._id; 	    		
    	})

	    it('devuelve un error 400 si el título del enlace es vacío', async () => {
	    	nuevoTitulo = '';	    	
	      
	      	const res = await exec();

	      	expect(res.status).toBe(400);
	    });

	    it('devuelve un error 400 si la url del enlace es vacía', async () => {
	      	nuevaUrl = '';
	      	
	      	const res = await exec();

	      	expect(res.status).toBe(400);
	    });

	    it('devuelve un error 404 si el id no es válido', async () => {
	      id = 1;

	      const res = await exec();

	      expect(res.status).toBe(404);
	    });

	    it('devuelve un error 404 si el id no es válido', async () => {
	      id = mongoose.Types.ObjectId();	      

	      const res = await exec();

	      expect(res.status).toBe(404);
	    });

	    it('devuelve el enlace actualizado si éste es válido', async () => {
	      await exec();

	      const enlace = await Enlace.findById(id);

	      expect(enlace.titulo).toBe(nuevoTitulo);
	    });

	    it('devuelve el enlace actualizado si éste es válido', async () => {
	      const res = await exec();

	      expect(res.body).toHaveProperty('_id');
	      expect(res.body).toHaveProperty('titulo', nuevoTitulo);
	      expect(res.body).toHaveProperty('url', nuevaUrl);
	    });
	});
})
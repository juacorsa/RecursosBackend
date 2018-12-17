const request = require('supertest');
const mongoose = require('mongoose');
const {Tema} = require('../models/tema');

let server;

describe('/api/temas', () => {
	beforeEach(() => { server = require('../server'); });
	afterEach(async ()  => { 
		server.close(); 
		await Tema.deleteMany({});
	});

	describe('GET /', () => {
		it('devuelve todos los temas', async () => {
			await Tema.deleteMany({});

			Tema.collection.insertMany([
				{ nombre: 'tema1' },
				{ nombre: 'tema2' }
			]);

			const res = await request(server).get('/api/temas');

			expect(res.status).toBe(200);			
			expect(res.body.some(e => e.nombre === 'tema1')).toBeTruthy();
			expect(res.body.some(e => e.nombre === 'tema2')).toBeTruthy();
		});
	});

	describe('GET /:id', () => {
		it('devuelve un tema si le pasamos un id válido', async () => {
			const tema = new Tema({ nombre: 'tema1' });
			await tema.save();			

			const res = await request(server).get('/api/temas/' + tema._id);

			expect(tema).not.toBeNull();							
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const res = await request(server).get('/api/temas/1');

			expect(res.status).toBe(404);
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const id  = mongoose.Types.ObjectId();
			const res = await request(server).get('/api/temas/' + id);

			expect(res.status).toBe(404);
		});
	});

	describe('POST /', () => {
		let nombre;

		const exec = async () => {
			return await request(server)
		        .post('/api/temas/')
		        .send({ nombre });
		}		

		beforeEach(() => {      		
      		nombre = 'tema1'; 
    	})

		it('devuelve un error 400 si el nombre del tema es superior a 50 caracteres', async () => {
			nombre = new Array(52).join('a');

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si el nombre del tema es vacío', async () => {
			nombre = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});		

	    it('devuelve un tema si es válido', async () => {		
			const res = await exec();

	      	const tema = await Tema.find({ nombre });

	      	expect(tema).not.toBeNull();
	    });

	    it('devuelve un tema si es válido', async () => {
			const res = await exec();		

	      	expect(res.body).toHaveProperty('_id');	      	
	      	expect(res.body).toHaveProperty('nombre', nombre);
	    });
	});

	describe('PUT /', () => {
		let nuevoNombre;
		let id;
		let tema;

    	const exec = async () => {
      		return await request(server)
        		.put('/api/temas/' + id)        
        		.send({ nombre: nuevoNombre });
    	}

    	beforeEach(async () => {     
        	tema = new Tema({ nombre: 'tema1' });
      		await tema.save();      
      
      		id = tema._id; 	
      		nuevoNombre = 'temaActualizado'; 
    	})

	    it('devuelve un error 400 if el nombre del tema es superior a 50 caracteres', async () => {
	    	nuevoNombre = new Array(52).join('a');
	      
	      	const res = await exec();

	      	expect(res.status).toBe(400);
	    });

	    it('devuelve un error 400 if el nombre del tema es vacío', async () => {
	    	nuevoNombre = '';
	      
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
	      nuevoNombre = new Array(10).join('a');

	      const res = await exec();

	      expect(res.status).toBe(404);
	    });

	    it('devuelve el tema actualizado si éste es válido', async () => {
	      await exec();

	      const temaActualizado = await Tema.findById(tema._id);

	      expect(temaActualizado.nombre).toBe(nuevoNombre);
	    });

	    it('devuelve el tema actualizado si éste es válido', async () => {
	      const res = await exec();

	      expect(res.body).toHaveProperty('_id');
	      expect(res.body).toHaveProperty('nombre', nuevoNombre);
	    });
	});
});
const request = require('supertest');
const mongoose = require('mongoose');
const {Fabricante} = require('../models/fabricante');

let server;

describe('/api/fabricantes', () => {
	beforeEach(() => { server = require('../server'); });
	afterEach(async ()  => { 
		server.close(); 
		await Fabricante.deleteMany({});
	});

	describe('GET /', () => {
		it('devuelve todos los fabricantes', async () => {
			Fabricante.collection.insertMany([
				{ nombre: 'fabricante1' },
				{ nombre: 'fabricante2' }
			]);

			const res = await request(server).get('/api/fabricantes');

			expect(res.status).toBe(200);			
			expect(res.body.some(e => e.nombre === 'fabricante1')).toBeTruthy();
			expect(res.body.some(e => e.nombre === 'fabricante2')).toBeTruthy();
		});
	});

	describe('GET /:id', () => {
		it('devuelve un fabricante si le pasamos un id válido', async () => {
			const fabricante = new Fabricante({ nombre: 'fabricante1' });
			await fabricante.save();			

			const res = await request(server).get('/api/fabricantes/' + fabricante._id);

			expect(fabricante).not.toBeNull();							
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const res = await request(server).get('/api/fabricantes/1');

			expect(res.status).toBe(404);
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const id  = mongoose.Types.ObjectId();
			const res = await request(server).get('/api/fabricantes/' + id);

			expect(res.status).toBe(404);
		});
	});

	describe('POST /', () => {
		let nombre;

		const exec = async () => {
			return await request(server)
		        .post('/api/fabricantes/')
		        .send({ nombre });
		}		

		beforeEach(() => {      		
      		nombre = 'fabricante1'; 
    	})

		it('devuelve un error 400 si el nombre es superior a 50 caracteres', async () => {
			nombre = new Array(52).join('a');

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si el nombre del fabricante es vacío', async () => {
			nombre = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});		

	    it('devuelve un fabricante si es válido', async () => {		
			const res = await exec();

	      	const fabricante = await Fabricante.find({ nombre });

	      	expect(fabricante).not.toBeNull();
	    });

	    it('devuelve un fabricante si es válido', async () => {
			const res = await exec();		

	      	expect(res.body).toHaveProperty('_id');	      	
	      	expect(res.body).toHaveProperty('nombre', nombre);
	    });
	});

	describe('PUT /', () => {
		let nuevoNombre;
		let id;
		let fabricante;

    	const exec = async () => {
      		return await request(server)
        		.put('/api/fabricantes/' + id)        
        		.send({ nombre: nuevoNombre });
    	}

    	beforeEach(async () => {     
        	fabricante = new Fabricante({ nombre: 'fabricante1' });
      		await fabricante.save();      
      
      		id = fabricante._id; 	
      		nuevoNombre = 'fabricanteActualizado'; 
    	})

	    it('devuelve un error 400 if el nombre del fabricante es superior a 50 caracteres', async () => {
	    	nuevoNombre = new Array(52).join('a');
	      
	      	const res = await exec();

	      	expect(res.status).toBe(400);
	    });

	    it('devuelve un error 400 if el nombre del fabricante es vacío', async () => {
	    	nuevoNombre = '';
	      
	      	const res = await exec();

	      	expect(res.status).toBe(400);
	    });

	    it('devuelve un error 404 si el id no es válido', async () => {
	      id = 1;

	      const res = await exec();

	      expect(res.status).toBe(404);
	    });

	    it('devuelve un error 404 si el id del fabricante no es válido', async () => {
	      id = mongoose.Types.ObjectId();
	      nuevoNombre = new Array(10).join('a');

	      const res = await exec();

	      expect(res.status).toBe(404);
	    });

	    it('devuelve el fabricante actualizado si éste es válido', async () => {
	      await exec();

	      const fabricanteActualizado = await Fabricante.findById(fabricante._id);

	      expect(fabricanteActualizado	.nombre).toBe(nuevoNombre);
	    });

	    it('devuelve el fabricante actualizado si éste es válido', async () => {
	      const res = await exec();

	      expect(res.body).toHaveProperty('_id');
	      expect(res.body).toHaveProperty('nombre', nuevoNombre);
	    });
	});
});


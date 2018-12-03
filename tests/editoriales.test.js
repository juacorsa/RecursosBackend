const request = require('supertest');
const mongoose = require('mongoose');
const {Editorial} = require('../models/editorial');

let server;

describe('/api/editoriales', () => {
	beforeEach(() => { server = require('../server'); });
	afterEach(async ()  => { 
		server.close(); 
		await Editorial.deleteMany({});
	});

	describe('GET /', () => {
		it('devuelve todas las editoriales', async () => {
			Editorial.collection.insertMany([
				{ nombre: 'editorial1' },
				{ nombre: 'editorial2' }
			]);

			const res = await request(server).get('/api/editoriales');

			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2);
			expect(res.body.some(e => e.nombre === 'editorial1')).toBeTruthy();
			expect(res.body.some(e => e.nombre === 'editorial2')).toBeTruthy();
		});
	});

	describe('GET /:id', () => {
		it('devuelve una editorial si le pasamos un id válido', async () => {
			const editorial = new Editorial({ nombre: 'editorial1' });
			await editorial.save();			

			const res = await request(server).get('/api/editoriales/' + editorial._id);

			expect(res.status).toBe(200);					
			expect(res.body).toHaveProperty('nombre', editorial.nombre);
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const res = await request(server).get('/api/editoriales/1');

			expect(res.status).toBe(404);
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const id  = mongoose.Types.ObjectId();
			const res = await request(server).get('/api/editoriales/' + id);

			expect(res.status).toBe(404);
		});
	});

	describe('POST /', () => {
		let nombre;

		const exec = async () => {
			return await request(server)
		        .post('/api/editoriales/')
		        .send({ nombre });
		}		

		beforeEach(() => {      		
      		nombre = 'editorial1'; 
    	})

		it('devuelve un error 400 si el nombre es superior a 50 caracteres', async () => {
			nombre = new Array(52).join('a');

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si el nombre de la editorial es vacío', async () => {
			nombre = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});		

	    it('devuelve una editorial si es válida', async () => {		
			const res = await exec();

	      	const editorial = await Editorial.find({ nombre });

	      	expect(editorial).not.toBeNull();
	    });

	    it('devuelve una editorial si es válida', async () => {
			const res = await exec();		

	      	expect(res.body).toHaveProperty('_id');	      	
	      	expect(res.body).toHaveProperty('nombre', nombre);
	    });

	});

	describe('PUT /', () => {
		let nuevoNombre;
		let id;
		let editorial;

    	const exec = async () => {
      		return await request(server)
        		.put('/api/editoriales/' + id)        
        		.send({ nombre: nuevoNombre });
    	}

    	beforeEach(async () => {     
        	editorial = new Editorial({ nombre: 'editorial1' });
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
	});
})



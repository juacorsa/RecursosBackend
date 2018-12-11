const request = require('supertest');
const mongoose = require('mongoose');
const {Valoracion} = require('../models/valoracion');

let server;

describe('/api/valoraciones', () => {
	beforeEach(() => { server = require('../server'); });
	afterEach(async ()  => { 
		server.close(); 
		await Valoracion.deleteMany({});
	});

	describe('GET /', () => {
		it('devuelve todas las valoraciones', async () => {
			await Valoracion.deleteMany({});

			Valoracion.collection.insertMany([
				{ nombre: 'valoracion1' },
				{ nombre: 'valoracion2' }
			]);

			const res = await request(server).get('/api/valoraciones');

			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2);
			expect(res.body.some(e => e.nombre === 'valoracion1')).toBeTruthy();
			expect(res.body.some(e => e.nombre === 'valoracion2')).toBeTruthy();
		});
	});

	describe('GET /:id', () => {
		it('devuelve una valoración si le pasamos un id válido', async () => {
			const valoracion = new Valoracion({ nombre: 'valoracion1' });
			await valoracion.save();			

			const res = await request(server).get('/api/valoracion/' + valoracion._id);

			expect(valoracion).not.toBeNull();							
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const res = await request(server).get('/api/valoraciones/1');

			expect(res.status).toBe(404);
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const id  = mongoose.Types.ObjectId();
			const res = await request(server).get('/api/valoraciones/' + id);

			expect(res.status).toBe(404);
		});
	});

	describe('POST /', () => {
		let nombre;

		const exec = async () => {
			return await request(server)
		        .post('/api/valoraciones/')
		        .send({ nombre });
		}		

		beforeEach(() => {      		
      		nombre = 'valoracion1'; 
    	})

		it('devuelve un error 400 si el nombre de la valoración es superior a 50 caracteres', async () => {
			nombre = new Array(52).join('a');

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si el nombre de la valoración es vacío', async () => {
			nombre = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});		

	    it('devuelve una valoración si es válida', async () => {		
			const res = await exec();

	      	const valoracion = await Valoracion.find({ nombre });

	      	expect(valoracion).not.toBeNull();
	    });

	    it('devuelve una valoración si es válida', async () => {
			const res = await exec();		

	      	expect(res.body).toHaveProperty('_id');	      	
	      	expect(res.body).toHaveProperty('nombre', nombre);
	    });
	});

	describe('PUT /', () => {
		let nuevoNombre;
		let id;
		let valoracion;

    	const exec = async () => {
      		return await request(server)
        		.put('/api/valoraciones/' + id)        
        		.send({ nombre: nuevoNombre });
    	}

    	beforeEach(async () => {     
        	valoracion = new Valoracion({ nombre: 'valoracion1' });
      		await valoracion.save();      
      
      		id = valoracion._id; 	
      		nuevoNombre = 'valoracionActualizada'; 
    	})

	    it('devuelve un error 400 if el nombre de la valoracion es superior a 50 caracteres', async () => {
	    	nuevoNombre = new Array(52).join('a');
	      
	      	const res = await exec();

	      	expect(res.status).toBe(400);
	    });

	    it('devuelve un error 400 if el nombre de la valoracion es vacío', async () => {
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

	    it('devuelve la valoración actualizada si ésta es válida', async () => {
	      await exec();

	      const valoracionActualizada = await Valoracion.findById(valoracion._id);

	      expect(valoracionActualizada.nombre).toBe(nuevoNombre);
	    });

	    it('devuelve la valoración actualizada si ésta es válido', async () => {
	      const res = await exec();

	      expect(res.body).toHaveProperty('_id');
	      expect(res.body).toHaveProperty('nombre', nuevoNombre);
	    });
	});
});

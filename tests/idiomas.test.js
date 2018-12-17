const request = require('supertest');
const mongoose = require('mongoose');
const {Idioma} = require('../models/idioma');

let server;

describe('/api/idiomas', () => {
	beforeEach(() => { server = require('../server'); });
	afterEach(async ()  => { 
		server.close(); 
		await Idioma.deleteMany({});
	});

	describe('GET /', () => {
		it('devuelve todos los idiomas', async () => {
			Idioma.collection.insertMany([
				{ nombre: 'idioma1' },
				{ nombre: 'idioma2' }
			]);

			const res = await request(server).get('/api/idiomas');

			expect(res.status).toBe(200);			
			expect(res.body.some(e => e.nombre === 'idioma1')).toBeTruthy();
			expect(res.body.some(e => e.nombre === 'idioma2')).toBeTruthy();
		});
	});

	describe('GET /:id', () => {
		it('devuelve un idioma si le pasamos un id válido', async () => {
			const idioma = new Idioma({ nombre: 'idioma1' });
			await idioma.save();			

			const res = await request(server).get('/api/idiomas/' + idioma._id);

			expect(idioma).not.toBeNull();							
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const res = await request(server).get('/api/idiomas/1');

			expect(res.status).toBe(404);
		});

		it('devuelve un error 404 si le pasamos un id no válido', async () => {
			const id  = mongoose.Types.ObjectId();
			const res = await request(server).get('/api/idiomas/' + id);

			expect(res.status).toBe(404);
		});
	});

	describe('POST /', () => {
		let nombre;

		const exec = async () => {
			return await request(server)
		        .post('/api/idiomas/')
		        .send({ nombre });
		}		

		beforeEach(() => {      		
      		nombre = 'idioma1'; 
    	})

		it('devuelve un error 400 si el nombre del idioma es superior a 25 caracteres', async () => {
			nombre = new Array(27).join('a');

			const res = await exec();
			
			expect(res.status).toBe(400);
		});

		it('devuelve un error 400 si el nombre del idioma es vacío', async () => {
			nombre = '';

			const res = await exec();
			
			expect(res.status).toBe(400);
		});		

	    it('devuelve un idioma si es válido', async () => {		
			const res = await exec();

	      	const idioma = await Idioma.find({ nombre });

	      	expect(idioma).not.toBeNull();
	    });

	    it('devuelve un idioma si es válido', async () => {
			const res = await exec();		

	      	expect(res.body).toHaveProperty('_id');	      	
	      	expect(res.body).toHaveProperty('nombre', nombre);
	    });
	});

	describe('PUT /', () => {
		let nuevoNombre;
		let id;
		let idioma;

    	const exec = async () => {
      		return await request(server)
        		.put('/api/idiomas/' + id)        
        		.send({ nombre: nuevoNombre });
    	}

    	beforeEach(async () => {     
        	idioma = new Idioma({ nombre: 'idioma1' });
      		await idioma.save();      
      
      		id = idioma._id; 	
      		nuevoNombre = 'idiomaActualizado'; 
    	})

	    it('devuelve un error 400 if el nombre del idioma es superior a 25 caracteres', async () => {
	    	nuevoNombre = new Array(27).join('a');
	      
	      	const res = await exec();

	      	expect(res.status).toBe(400);
	    });

	    it('devuelve un error 400 if el nombre del idioma es vacío', async () => {
	    	nuevoNombre = '';
	      
	      	const res = await exec();

	      	expect(res.status).toBe(400);
	    });

	    it('devuelve un error 404 si el id no es válido', async () => {
	      id = 1;

	      const res = await exec();

	      expect(res.status).toBe(404);
	    });

	    it('devuelve un error 404 si el id del idioma no es válido', async () => {
	      id = mongoose.Types.ObjectId();
	      nuevoNombre = new Array(10).join('a');

	      const res = await exec();

	      expect(res.status).toBe(404);
	    });

	    it('devuelve el idioma actualizado si éste es válido', async () => {
	      await exec();

	      const idiomaActualizado = await Idioma.findById(idioma._id);

	      expect(idiomaActualizado.nombre).toBe(nuevoNombre);
	    });

	    it('devuelve el idioma actualizado si éste es válido', async () => {
	      const res = await exec();

	      expect(res.body).toHaveProperty('_id');
	      expect(res.body).toHaveProperty('nombre', nuevoNombre);
	    });
	});
});
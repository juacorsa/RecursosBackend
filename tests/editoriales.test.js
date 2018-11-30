const request = require('supertest');
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

})



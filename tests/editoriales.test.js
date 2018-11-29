const request = require('supertest');
const {Editorial} = require('../models/editorial');

let server;

describe('/api/editoriales', () => {
	beforeEach(() => { server = require('../server'); });
	afterEach(async ()  => { 
		server.close(); 
		await Editorial.remove({});
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

			console.log(editorial);

			const res = request(server).get('/api/editoriales/' + editorial._id);

			expect(res.status).toBe(200);
			//expect(res.body).toHaveProperty('nombre', editorial.nombre);

		});
	});








})



import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'test@test.ru', password: '1' });

		expect(res.statusCode).toBe(422);
	});

	it('Login - success', async () => {
		const res = await request(application.app)
			.get('/users/login')
			.send({ email: 'test@test.ru', password: '12345' });

		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Login - error', async () => {
		const res = await request(application.app)
			.get('/users/login')
			.send({ email: 'test@test.ru', password: '2' });

		expect(res.statusCode).toBe(401);
	});

	it('Info - success', async () => {
		const login = await request(application.app)
			.get('/users/login')
			.send({ email: 'test@test.ru', password: '12345' });

		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);

		expect(res.body.id).toBe(1);
	});

	it('Info - fail', async () => {
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer test`);

		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});

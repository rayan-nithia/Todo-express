import request from 'supertest';
import { app } from './index'; 

const authHeaders = {
    username: 'admin',
    password: 'password',
};

describe('Todos API', () => {
    it('should create a new todo', async () => {
        const res = await request(app)
            .post('/todos')
            .set(authHeaders)
            .send({ title: 'Test Todo' });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('title', 'Test Todo');
    });

    it('should get all todos', async () => {
        const res = await request(app)
            .get('/todos')
            .set(authHeaders);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should get a todo by ID', async () => {
        const res = await request(app)
            .get('/todos/1') 
            .set(authHeaders);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', 1); 
    });

    it('should update a todo', async () => {
        const res = await request(app)
            .put('/todos/1') 
            .set(authHeaders)
            .send({ completed: true });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('completed', true);
    });

    it('should delete a todo', async () => {
        const res = await request(app)
            .delete('/todos/1') 
            .set(authHeaders);

        expect(res.statusCode).toEqual(204);
    });
});
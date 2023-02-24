const request = require('supertest');
const app = require('../../app')
describe('Test GET /Launches', ()=> {
    test('it should respond 200 status code', async () => {
        const response = await request(app).get('/launches')
        expect(response.statusCode).toBe(200)
    })
})
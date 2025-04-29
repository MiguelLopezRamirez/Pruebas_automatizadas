const request = require('supertest');
const { expect } = require('chai');

// URL base de la API
const API_BASE_URL = 'https://api-debates-4.onrender.com';

describe('Endpoint no encontrado (404 Not Found)', () => {
    it('Debe devolver 404 cuando se accede a un endpoint inexistente', async () => {
        const res = await request(API_BASE_URL)
            .get('/api/v1/endpoint-inexistente'); // Ruta que no existe
        expect(res.status).to.equal(404);
    });
});

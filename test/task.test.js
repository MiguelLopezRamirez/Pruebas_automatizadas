// const app = require('../app'); // Aplicación Express (si estás probando localmente)
const request = require('supertest'); // Para testing de HTTP
const chai = require('chai');
const expect = chai.expect;

// URL base de la API
const API_BASE_URL = 'https://api-debates-4.onrender.com';
const LOGIN_URL = `${API_BASE_URL}/auth/login`;
const DEBATES_URL = `${API_BASE_URL}/api/v1/debates`;

describe('API de Debates', () => {
    let authToken; // Variable para almacenar el token JWT

    // Primero nos autenticamos antes de ejecutar las pruebas
    before(async () => {
        const credentials = {
            username: "gelo002",
            password: "12345678"
        };

        const res = await request(API_BASE_URL)
            .post('/auth/login')
            .send(credentials);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');
        
        authToken = res.body.token; // Guardamos el token para usarlo en las demás pruebas
    });

    it('Debe obtener todos los debates', async () => {
        const res = await request(API_BASE_URL)
            .get('/api/v1/debates')
            .set('Authorization', `Bearer ${authToken}`);
        
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        
        // Verificación adicional de estructura de datos
        if (res.body.length > 0) {
            // expect(res.body[0]).to.have.property('id');
            // expect(res.body[0]).to.have.property('title');
            // Agrega más propiedades según lo que esperas de un debate
        }
    });

    // it('Debe crear un nuevo debate', async () => {
    //     const newDebate = {
    //         title: "Debate de prueba",
    //         description: "Este es un debate creado desde las pruebas",
    //         // otros campos necesarios para crear un debate
    //     };

    //     const res = await request(API_BASE_URL)
    //         .post('/api/v1/debates')
    //         .set('Authorization', `Bearer ${authToken}`)
    //         .send(newDebate);

    //     expect(res.status).to.equal(201);
    //     expect(res.body).to.have.property('title', newDebate.title);
    //     expect(res.body).to.have.property('id');
    // });

    // it('No debe permitir acceso sin token', async () => {
    //     const res = await request(API_BASE_URL)
    //         .get('/api/v1/debates');
        
    //     expect(res.status).to.equal(401); // No autorizado
    // });

    // Puedes agregar más pruebas para:
    // - Obtener un debate por ID
    // - Actualizar un debate
    // - Eliminar un debate
    // - Casos de error
});
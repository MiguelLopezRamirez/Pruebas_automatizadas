// const app = require('../app'); // Aplicación Express (si estás probando localmente)
const request = require('supertest'); // Para testing de HTTP
const chai = require('chai');
const expect = chai.expect;

// URL base de la API
const API_BASE_URL = 'https://api-debates-4.onrender.com';
const LOGIN_URL = `${API_BASE_URL}/auth/login`;
const DEBATES_URL = `${API_BASE_URL}/api/v1/debates`;

describe('End points de Debate', () => {
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
    describe('POST api/v1/debate' , ()=>{
        const categories = ['Filosofía', 'Política', 'Cultura Pop', 'Conspiraciones'];

        categories.forEach(category => {
            it(`Debe crear un nuevo debate en la categoría ${category}`, async () => {
                const newDebate = {
                    title: `Debate de prueba - ${category}`,
                    argument: `Este es un debate de prueba para ${category}`,
                    category: category
                };
    
                const res = await request(API_BASE_URL)
                    .post('/api/v1/debate')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(newDebate);

                expect(res.status).to.equal(201);
            });
        });
        it('No debe de permitir crear un debate con una categoria desconocida', async () => {
            const newDebate = {
                title: "Debate de prueba",
                argument: "Este es un debate creado desde las pruebas",
                category: "Políti"
            };

            const res = await request(API_BASE_URL)
                .post('/api/v1/debate')
                .set('Authorization', `Bearer ${authToken}`)
                .send(newDebate);

            expect(res.status).to.equal(400);
        });

        it('No debe de permitir crear un debate sin autetifiación', async () => {
            const newDebate = {
                title: "Debate de prueba",
                argument: "Este es un debate creado desde las pruebas",
                category: "Política"
            };

            const res = await request(API_BASE_URL)
                .post('/api/v1/debate')
                .set('Authorization', `Bearer nomeAutentifiqueCisco123`)
                .send(newDebate);

            expect(res.status).to.equal(401);
        });
    });
    

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
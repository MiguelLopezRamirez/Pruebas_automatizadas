const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const API_BASE_URL = 'https://api-debates-4.onrender.com';

describe('Endpoints de Autenticación', () => {
    // Datos de prueba
    const testUser = {
        username: `testuser_${Math.floor(Math.random() * 10000)}`, // Usuario único
        password: 'testpass123'
    };

    describe('POST /auth/register', () => {
        it('debe registrar un nuevo usuario exitosamente', async () => {
            const res = await request(API_BASE_URL)
                .post('/auth/register')
                .send(testUser);

            expect(res.status).to.equal(200);
        });

        it('debe rechazar registro con nombre de usuario repetido', async () => {
            const res = await request(API_BASE_URL)
                .post('/auth/register')
                .send(testUser); // Mismo usuario que ya registramos

            expect(res.status).to.equal(400);
        });

        it('debe rechazar nombre de usuario con espacios', async () => {
            const res = await request(API_BASE_URL)
                .post('/auth/register')
                .send({
                    username: 'nombre con espacios',
                    password: 'validpass123'
                });

            expect(res.status).to.equal(400);
        });

        it('debe rechazar nombre de usuario mayor a 16 caracteres', async () => {
            const res = await request(API_BASE_URL)
                .post('/auth/register')
                .send({
                    username: 'nombremuylargomasde16caracteres',
                    password: 'validpass123'
                });

            expect(res.status).to.equal(400);
        });

        it('debe rechazar contraseña con espacios', async () => {
            const res = await request(API_BASE_URL)
                .post('/auth/register')
                .send({
                    username: 'nuevousuario',
                    password: 'pass con espacios'
                });

            expect(res.status).to.equal(400);
        });

        it('debe rechazar contraseña menor a 8 caracteres', async () => {
            const res = await request(API_BASE_URL)
                .post('/auth/register')
                .send({
                    username: 'nuevousuario',
                    password: 'short'
                });

            expect(res.status).to.equal(400);        });
    });

    describe('POST /auth/login', () => {
        it('debe iniciar sesión exitosamente con credenciales válidas', async () => {
            const res = await request(API_BASE_URL)
                .post('/auth/login')
                .send({
                    username: testUser.username,
                    password: testUser.password
                });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('token');
            // Verificar que el token es válido (puedes decodificarlo si es necesario)
            expect(res.body.token.split('.').length).to.equal(3); // Verifica estructura básica JWT
        });

        it('debe rechazar inicio de sesión con contraseña incorrecta', async () => {
            const res = await request(API_BASE_URL)
                .post('/auth/login')
                .send({
                    username: testUser.username,
                    password: 'contraseña-incorrecta'
                });

            expect(res.status).to.equal(400);
        });

        it('debe rechazar inicio de sesión con usuario inexistente', async () => {
            const res = await request(API_BASE_URL)
                .post('/auth/login')
                .send({
                    username: 'usuarioinexistente',
                    password: 'cualquiercontraseña'
                });

            expect(res.status).to.equal(400);
        });
    });
});
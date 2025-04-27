const request = require('supertest');
const { expect } = require('chai');

// URL base de la API
const API_BASE_URL = 'https://api-debates-4.onrender.com';
const COMMENT_URL = `${API_BASE_URL}/api/v1/comment`;

describe('Endpoints de Comentarios', () => {
    let authToken; // Token JWT
    let commentId = "1745716175576"; // IMPORTANTE. Cada vez que se ejecute se debe agregar un ID de comentario existente. No lo automaticé con el POST porque no retorna el ID. 

    // Iniciar sesión antes de las pruebas
    before(async () => {
        const credentials = {
            username: "aramis",
            password: "aramis123"
        };
        const loginRes = await request(API_BASE_URL)
            .post('/auth/login')
            .send(credentials);
        
        expect(loginRes.status).to.equal(200);
        expect(loginRes.body).to.have.property('token');
        authToken = loginRes.body.token;
    });

    // PUT /comment/:id
    describe('PUT /comment/:id', () => {
        it('Debe actualizar un comentario existente (200 Ok)', async () => {
            const updatedComment = {
                username: "aramis",
                position: false, 
                argument: "Argumento actualizado desde pruebas"
            };

            const res = await request(COMMENT_URL)
                .put(`/${commentId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedComment);

            expect(res.status).to.equal(200); // Nosotros en la documentación lo manejamos como 201, pero al implementarlo lo cambiaron al 200, por eso lo cambié. 
        });

        it('Debe rechazar actualización sin autenticación (403 Forbidden)', async () => {
            const res = await request(COMMENT_URL)
            .put(`/${commentId}`)
                .send({ position: true, argument: "No debería funcionar" });

            expect(res.status).to.equal(403); // Nosotros en la documentación lo manejamos como 401, pero al implementarlo lo cambiaron al 403, por eso lo cambié. 
        });

        it('Debe rechazar actualización con argumentos inválidos (400 Bad Request)', async () => {
            const res = await request(COMMENT_URL)
                .put(`/${commentId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ position: "no-es-booleano" }); 

            expect(res.status).to.equal(400);
        });

        it('Debe rechazar actualización de comentario inexistente (404 Not Found)', async () => {
            const fakeCommentId = "1234567890";
            const res = await request(COMMENT_URL)
                .put(`/${fakeCommentId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ position: true, argument: "Comentario falso" });

            expect(res.status).to.equal(404);
        });
    });

    // DELETE /comment/:id
    describe('DELETE /comment/:id', () => {
        it('Debe eliminar un comentario existente (200 OK)', async () => {
            const res = await request(COMMENT_URL)
                .delete(`/${commentId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).to.equal(200);
        });

        it('Debe rechazar eliminación sin autenticación (403 Forbidden)', async () => {
            const res = await request(COMMENT_URL)
                .delete(`/${commentId}`)

            expect(res.status).to.equal(403); // Nosotros en la documentación lo manejamos como 401, pero al implementarlo lo cambiaron al 403, por eso lo cambié. 
        });

        it('Debe rechazar eliminación de comentario inexistente (404 Not Found)', async () => {
            const fakeCommentId = "9876543210";
            const res = await request(COMMENT_URL)
                .delete(`/${fakeCommentId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).to.equal(404);
        });
    });
});
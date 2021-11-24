'use strict';
const request = require('supertest');
const app = require('../mocks/app');
require('should');
const {User} = require('@models');

describe('User', function() {
    let application;
    before(() => {
        return app.start()
            .then((dataApp) => {
                application = dataApp;
                return User.deleteMany({});
            })
            .then(() => {
                return Promise.all([
                    User.create({
                        _id: '00000000000000aabb000001',
                        fullname: 'User One',
                        email: 'userone@mail.com',
                        role: 'admin',
                        password: 'soyunapassword'
                    })
                ]);
            });
    });

    after(() => {
        return User.deleteMany({})
            .then(() => {
                return app.finish();
            });
    });

    describe('GET', () => {
        it('/users - should return Unauthorized', function() {
            return request(application)
                .get('/api/users')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });

        it('/users/:id - should return Unauthorized', function() {
            return request(application)
                .get('/api/users/00000000000000aabb000002')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });

    describe('PUT', () => {
        it('/users/:id - should return Unauthorized', function() {
            return request(application)
                .put('/api/users/00000000000000aabb000001')
                .set('Accept', 'application/json')
                .send({
                    email: 'emailchanged@mail.com'
                })
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });

    describe('PATCH', () => {
        it('/users/:id - should return Unauthorized', function() {
            return request(application)
                .put('/api/users/00000000000000aabb000001')
                .set('Accept', 'application/json')
                .send({
                    email: 'emailchanged@mail.com'
                })
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });

    describe('DELETE', () => {
        it('/users/:id - should return Unauthorized', function() {
            return request(application)
                .delete('/api/users/00000000000000aabb000001')
                .set('Accept', 'application/json')
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });

    describe('POST', () => {
        it('/users - should return Unauthorized', function() {
            return request(application)
                .post('/api/users')
                .set('Accept', 'application/json')
                .send({
                    email: 'newuser@mail.com',
                    fullname: 'Person name'
                })
                .expect(401)
                .then((response) => {
                    response.body.code.should.be.equal('unauthorized');
                    response.body.message.should.be.equal('Unauthorized');
                });
        });
    });
});

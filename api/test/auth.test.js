const app = require('../server');
const chai = require('chai');
chai.use(require('chai-http'));
const expect = chai.expect;
const mongoose = require('mongoose');
const config = require('../config/config');

describe('App Authentication', () => {
    before((done) => {
        mongoose.connect(config.db, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true});
        mongoose.connection.once('open', () => {
            mongoose.connection.dropDatabase(() => {
                done();
            });
        });
    });

    describe('Signup', () => {
        it(`should send a message saying the signup was sucessful and the authentication token`, (done) => {
            input = {
                name: 'Test User',
                email: 'mail@test.com',
                phone: '12345',
                password: 'Password'
            };

            chai.request(app)
            .post(`/api/auth/signup`)
            .send(input)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message', 'Signup successful');
                expect(res.body).to.have.property('token');
                done();
            })
        });

        it(`should send a 400 code if the input is invalid`, (done) => {
            chai.request(app)
            .post(`/api/auth/signup`)
            .then(res => {
                expect(res).to.have.status(400);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message');
                done();
            });
        });
    });

    describe(`Login`, () => {
        it(`should login a user with valid login information`, (done) => {
            input = {
                email: 'mail@test.com',
                password: 'Password'
            };

            chai.request(app)
            .post(`/api/auth/login`)
            .send(input)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('token');
                done();
            });
        });

        it(`should send a 400 code when given the wrong credentials`, (done) => {
            chai.request(app)
            .post(`/api/auth/login`)
            .then(res => {
                expect(res).to.have.status(400);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message');
                done();
            });
        });
    });
});
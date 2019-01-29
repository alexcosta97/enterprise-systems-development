const User = require('../models/user.server.model');
const app = require('../server');
const chai = require('chai');
chai.use(require('chai-http'));
const expect = chai.expect;
const mongoose = require('mongoose');
const config = require('../config/config');

let user;
let input;
let token;

describe('Users Controller', () => {
    before((done) => {
        mongoose.connect(config.db, {useNewUrlParser: true, useCreateIndex: true});
        mongoose.connection.once('open', () => {
            user = new User({
                name: 'Test User',
                email: 'mail@test.com',
                phone: '12345',
                password: 'Password'
            });
            user.save((err, user) => {
                token = user.signToken();
                input = {
                    name: 'User Test',
                    email: 'mail@mail.com',
                    phone: '23456',
                    password: 'Password'
                };
                done();
            })
        });
    });

    describe('Get User', () => {
        it(`should send a JSON response with the details of the user`, (done) => {
            chai.request(app)
            .get(`/api/users/${user._id.toString()}`)
            .set('Accept', 'application/json')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('name', user.name);
                expect(res.body).to.have.property('email', user.email);
                expect(res.body).to.have.property('phone', user.phone);
                expect(res.body).to.not.have.property('password');
                done();
            });
        });

        it(`should send a 404 status if the user with the given ID does not exist`, (done) => {
            chai.request(app)
            .get('/api/users/507f1f77bcf86cd799439011')
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message', 'There was no user with the given ID.');
                done();
            });
        });

        it(`should send a 400 status if the ID sent is invalid`, (done) => {
            chai.request(app)
            .get(`/api/users/fakeID`)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message', 'Invalid User ID');
                done();
            });
        });
    });

    describe('Update User', () => {
        it(`should send a message informing the user was updated`, (done) => {
            chai.request(app)
            .put(`/api/users/`)
            .set('x-auth-token', token)
            .send(input)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id', user._id.toString());
                expect(res.body).to.not.have.property('password');
                done();
            });
        });

        it(`should send a 400 code and error message when given the wrong input`, (done) => {
            input.email = 'mail';
            chai.request(app)
            .put(`/api/users/`)
            .set('x-auth-token', token)
            .send(input)
            .then(res => {
                expect(res).to.have.status(400);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message');
                done();
            });
        });

        it(`should send a 401 code if given the wrong auth token`, (done) => {
            input.email = 'maiL@mail.com';
            chai.request(app)
            .put('/api/users/')
            .send(input)
            .then(res => {
                expect(res).to.have.status(401);
                done();
            });
        });
    });

    describe('Delete User', () => {
        it(`should send back the user object when given a valid token`, (done) => {
            chai.request(app)
            .delete(`/api/users/`)
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id', user._id.toString());
                done();
            });
        });

        it(`should send a 401 code if given the wrong auth token`, (done) => {
            chai.request(app)
            .delete(`/api/users/`)
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
        });
    });
});
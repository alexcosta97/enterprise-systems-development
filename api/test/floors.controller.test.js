const User = require('../models/user.server.model');
const {Property} = require('../models/property.server.model');
const {Floor} = require('../models/floor.server.model');
const app = require('../server');
const chai = require('chai');
chai.use(require('chai-http'));
const expect = chai.expect;
const mongoose = require('mongoose');
const config = require('../config/config');
const fs = require('fs');

let user;
let property;
let floor;
let input;
let token;

describe('Floors Controller', () => {
    before(done => {
        mongoose.connect(config.db, {useNewUrlParser: true,
        useCreateIndex: true, useFindAndModify: true});
        mongoose.connection.once('open', () => {
            mongoose.connection.dropDatabase(() => {
                user = new User({
                    name: 'Test User',
                    email: 'mail@test.com',
                    phone: '12345',
                    password: 'Password'
                });
                user.save((err, user) => {
                    token = user.signToken();
                    property = new Property({
                        title: 'Lovely House',
                        address: {
                            houseNumber: '1',
                            street: 'Street',
                            town: 'Town',
                            postCode: 'PC1',
                            country: 'Country'
                        },
                        agent: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            phone: user.phone
                        }
                    });
                    property.save((err, property) => {
                        floor = new Floor({
                            property: property._id.toString(),
                            level: '1'
                        });
                        floor.save((err, floor) => {
                            input = {
                                property: property._id.toString(),
                                level: '2'
                            };
                            done();
                        });
                    });
                });
            });
        });
    });

    describe('Get All Floors', () => {
        it(`should send an array with all the floors available for the property`, (done) => {
            chai.request(app)
            .get(`/api/floors/?property=${property._id.toString()}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body[0]).to.have.property('_id', floor._id.toString());
                done();
            });
        });
    });

    describe('Get Floor', () => {
        it(`should send an object containing the data of a floor`, (done) => {
            chai.request(app)
            .get(`/api/floors/${floor._id.toString()}`)
            .end((err, res) => {
                expect(res).to.has.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id', floor._id.toString());
                done();
            });
        });

        it(`should send a 404 code if the floor doesn't exist`, (done) => {
            chai.request(app)
            .get(`/api/floors/${config.emptyID}`)
            .end((err, res) => {
                expect(res).to.has.status(404);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message', 'There was no floor with the given ID.');
                done();
            });
        });

        it(`should send a 400 code if the ID sent isn't valid`, (done) => {
            chai.request(app)
            .get(`/api/floors/fakeID`)
            .end((err, res) => {
                expect(res).to.has.status(400);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message', `The given ID isn't valid`);
                done();
            });
        });
    });

    // describe('Create Floor', () => {
    //     it(`should send the newly created floor`, (done) => {
    //         chai.request(app)
    //         .post(`/api/floors/`)
    //         .type('form')
    //         .attach('picture', fs.readFileSync('test.png'), 'test.png')
    //         .set('x-auth-token', token)
    //         .send(input)
    //         .then(res => {
    //             expect(res).to.have.status(200);
    //             expect(res).to.be.json;
    //             expect(res.body).to.be.an('object');
    //             expect(res.body).to.have.property('level', input.level);
    //             done();
    //         });
    //     });

    //     it(`should send a 400 error if the input is incorrect`, (done) => {
    //         chai.request(app)
    //         .post(`/api/floors`)
    //         .type('form')
    //         .attach('picture', fs.readFileSync('test.png'), 'test.png')
    //         .set('x-auth-token', token)
    //         .then(res => {
    //             expect(res).to.have.status(400);
    //             expect(res).to.be.json;
    //             expect(res.body).to.be.an('object');
    //             expect(res.body).to.have.property('message');
    //             done();
    //         });
    //     });
    // });

    // describe('Update Floor', () => {
    //     it(`should send the newly updated floor if the input is correct`, (done) => {
    //         chai.request(app)
    //         .put(`/api/floors/${floor._id.toString()}`)
    //         .type('form')
    //         .attach('picture', fs.readFileSync('test.png'), 'test.png')
    //         .set('x-auth-token', token)
    //         .send(input)
    //         .then(res => {
    //             expect(res).to.has.status(200);
    //             expect(res).to.be.json;
    //             expect(res.body).to.be.an('object');
    //             expect(res.body).to.have.property('_id', floor._id.toString());
    //             done();
    //         });
    //     });

    //     it(`should send a 400 error if the input is incorrect`, (done) => {
    //         chai.request(app)
    //         .put(`/api/floors/${floor._id.toString()}`)
    //         .type('form')
    //         .set('x-auth-token', token)
    //         .attach('picture', fs.readFileSync('test.png'), 'test.png')
    //         .then(res => {
    //             expect(res).to.have.status(400);
    //             expect(res).to.be.json;
    //             expect(res.body).to.be.an('object');
    //             expect(res.body).to.have.property('message');
    //             done();
    //         });
    //     });

    //     it(`should send a 404 code if the floor doesn't exist`, (done) => {
    //         chai.request(app)
    //         .put(`/api/floors/${config.emptyID}`)
    //         .type('form')
    //         .send(input)
    //         .attach('picture', fs.readFileSync('test.png'), 'test.png')
    //         .set('x-auth-token', token)
    //         .then(res => {
    //             expect(res).to.has.status(404);
    //             expect(res).to.be.json;
    //             expect(res.body).to.be.an('object');
    //             expect(res.body).to.have.property('message', 'There was no floor with the given ID.');
    //             done();
    //         });
    //     });

    //     it(`should send a 400 code if the ID sent isn't valid`, (done) => {
    //         chai.request(app)
    //         .put(`/api/floors/fakeID`)
    //         .type('form')
    //         .attach('picture', fs.readFileSync('test.png'), 'test.png')
    //         .set('x-auth-token', token)
    //         .send(input)
    //         .then(res => {
    //             expect(res).to.has.status(400);
    //             expect(res).to.be.json;
    //             expect(res.body).to.be.an('object');
    //             expect(res.body).to.have.property('message', `The given ID isn't valid`);
    //             done();
    //         });
    //     });
    // });

    describe('Delete Floor', () => {
        it(`should send back the floor when given a valid ID`, (done) => {
            chai.request(app)
            .delete(`/api/floors/${floor._id.toString()}`)
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id', floor._id.toString());
                done();
            });
        });

        it(`should send a 404 code if the floor doesn't exist`, (done) => {
            chai.request(app)
            .delete(`/api/floors/${config.emptyID}`)
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.has.property('message', 'There was no floor with the given ID.');
                done();
            });
        });

        it(`should send a 400 code if the floor ID given isn't valid`, (done) => {
            chai.request(app)
            .delete(`/api/floors/fakeID`)
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.has.property('message', 'Invalid Floor ID');
                done();
            });
        });
    });
});
const User = require('../models/user.server.model');
const {Property} = require('../models/property.server.model');
const app = require('../server');
const chai = require('chai');
chai.use(require('chai-http'));
const expect = chai.expect;
const mongoose = require('mongoose');
const config = require('../config/config');

let user;
let property;
let input;
let token;

describe('Properties Controller', () => {
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
                        input = {
                            houseNumber: '2',
                            street: 'Street',
                            town: 'Town',
                            postCode: 'PC1',
                            country: 'Country'
                        };
                        done();
                    });
                });
            });
        });
    });

    describe('Get All Properties', () => {
        it(`should send an array with all the properties available`, (done) => {
            chai.request(app)
            .get(`/api/properties/`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body[0]).to.have.property('_id', property._id.toString());
                done();
            });
        });
    });

    describe('Get Property', () => {
        it(`should send an object containing the data of a property`, (done) => {
            chai.request(app)
            .get(`/api/properties/${property._id.toString()}`)
            .end((err, res) => {
                expect(res).to.has.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id', property._id.toString());
                done();
            });
        });

        it(`should send a 404 code if the property doesn't exist`, (done) => {
            chai.request(app)
            .get(`/api/properties/${config.emptyID}`)
            .end((err, res) => {
                expect(res).to.has.status(404);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message', 'There was no property with the given ID.');
                done();
            });
        });

        it(`should send a 400 code if the ID sent isn't valid`, (done) => {
            chai.request(app)
            .get(`/api/properties/fakeID`)
            .end((err, res) => {
                expect(res).to.has.status(400);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message', `The given ID isn't valid`);
                done();
            });
        });
    });

    describe('Create Property', () => {
        it(`should send the newly created property`, (done) => {
            chai.request(app)
            .post(`/api/properties`)
            .set('x-auth-token', token)
            .send(input)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.address.houseNumber).to.be.equal(input.houseNumber);
                expect(res.body.agent._id).to.be.equal(user._id.toString());
                done();
            });
        });

        it(`should send a 400 error if the input is incorrect`, (done) => {
            chai.request(app)
            .post(`/api/properties`)
            .set('x-auth-token', token)
            .then(res => {
                expect(res).to.have.status(400);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message');
                done();
            });
        });
    });

    describe('Update Property', () => {
        it(`should send the newly updated property if the input is correct`, (done) => {
            chai.request(app)
            .put(`/api/properties/${property._id.toString()}`)
            .set('x-auth-token', token)
            .send(input)
            .then(res => {
                expect(res).to.has.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id', property._id.toString());
                done();
            });
        });

        it(`should send a 400 error if the input is incorrect`, (done) => {
            chai.request(app)
            .put(`/api/properties/${property._id.toString()}`)
            .set('x-auth-token', token)
            .then(res => {
                expect(res).to.have.status(400);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message');
                done();
            });
        });

        it(`should send a 404 code if the property doesn't exist`, (done) => {
            chai.request(app)
            .put(`/api/properties/${config.emptyID}`)
            .send(input)
            .set('x-auth-token', token)
            .then(res => {
                expect(res).to.has.status(404);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message', 'There was no property with the given ID.');
                done();
            });
        });

        it(`should send a 400 code if the ID sent isn't valid`, (done) => {
            chai.request(app)
            .put(`/api/properties/fakeID`)
            .set('x-auth-token', token)
            .send(input)
            .then(res => {
                expect(res).to.has.status(400);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message', `The given ID isn't valid`);
                done();
            });
        });
    });

    describe('Delete Property', () => {
        it(`should send back the property when given a valid ID`, (done) => {
            chai.request(app)
            .delete(`/api/properties/${property._id.toString()}`)
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id', property._id.toString());
                done();
            });
        });

        it(`should send a 404 code if the property doesn't exist`, (done) => {
            chai.request(app)
            .delete(`/api/properties/${config.emptyID}`)
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.has.property('message', 'There was no property with the given ID.');
                done();
            });
        });

        it(`should send a 400 code if the property ID given isn't valid`, (done) => {
            chai.request(app)
            .delete(`/api/properties/fakeID`)
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.has.property('message', 'Invalid Property ID');
                done();
            });
        });
    });
});
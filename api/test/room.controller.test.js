const User = require('../models/user.server.model');
const {Property} = require('../models/property.server.model');
const {Floor} = require('../models/floor.server.model');
const Room = require('../models/room.server.model');
const app = require('../server');
const chai = require('chai');
chai.use(require('chai-http'));
const expect = chai.expect;
const mongoose = require('mongoose');
const config = require('../config/config');

let user;
let property;
let floor;
let room;
let input;
let token;

describe('Rooms Controller', () => {
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
                            property: {
                                _id: property._id,
                                name: '1, Street'
                            },
                            level: '1'
                        });
                        floor.save((err, floor) => {
                            room = new Room({
                                floor: floor._id,
                                name: 'Room 1',
                                pixelsXMin: 10,
                                pixelsXMax: 20,
                                pixelsY: 10
                            });
                            room.save((err, room) => {
                                input = {
                                    floor: floor._id.toString(),
                                    name: 'Room 2',
                                    pixelsXMin: 20,
                                    pixelsXMax: 30,
                                    pixelsY: 10
                                };
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    describe('Get All Rooms', () => {
        it(`should send an array with all the rooms available for the floor`, (done) => {
            chai.request(app)
            .get(`/api/rooms/?floor=${floor._id.toString()}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body[0]).to.have.property('_id', room._id.toString());
                done();
            });
        });
    });

    describe('Get Room', () => {
        it(`should send an object containing the data of a Room`, (done) => {
            chai.request(app)
            .get(`/api/rooms/${room._id.toString()}`)
            .end((err, res) => {
                expect(res).to.has.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id', room._id.toString());
                done();
            });
        });

        it(`should send a 404 code if the room doesn't exist`, (done) => {
            chai.request(app)
            .get(`/api/rooms/${config.emptyID}`)
            .end((err, res) => {
                expect(res).to.has.status(404);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message', 'There was no room with the given ID.');
                done();
            });
        });

        it(`should send a 400 code if the ID sent isn't valid`, (done) => {
            chai.request(app)
            .get(`/api/rooms/fakeID`)
            .end((err, res) => {
                expect(res).to.has.status(400);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message', `The given ID isn't valid`);
                done();
            });
        });
    });

    describe('Create Room', () => {
        it(`should send the newly created room`, (done) => {
            chai.request(app)
            .post(`/api/rooms/`)
            .set('x-auth-token', token)
            .send(input)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('name', input.name);
                done();
            });
        });

        it(`should send a 400 error if the input is incorrect`, (done) => {
            chai.request(app)
            .post(`/api/rooms`)
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

    describe('Update Room', () => {
        it(`should send the newly updated room if the input is correct`, (done) => {
            chai.request(app)
            .put(`/api/rooms/${room._id.toString()}`)
            .set('x-auth-token', token)
            .send(input)
            .then(res => {
                expect(res).to.has.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id', room._id.toString());
                done();
            });
        });

        it(`should send a 400 error if the input is incorrect`, (done) => {
            chai.request(app)
            .put(`/api/rooms/${room._id.toString()}`)
            .set('x-auth-token', token)
            .then(res => {
                expect(res).to.have.status(400);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message');
                done();
            });
        });

        it(`should send a 404 code if the room doesn't exist`, (done) => {
            chai.request(app)
            .put(`/api/rooms/${config.emptyID}`)
            .send(input)
            .set('x-auth-token', token)
            .then(res => {
                expect(res).to.has.status(404);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message', 'There was no room with the given ID.');
                done();
            });
        });

        it(`should send a 400 code if the ID sent isn't valid`, (done) => {
            chai.request(app)
            .put(`/api/rooms/fakeID`)
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

    describe('Delete Room', () => {
        it(`should send back the room when given a valid ID`, (done) => {
            chai.request(app)
            .delete(`/api/rooms/${room._id.toString()}`)
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id', room._id.toString());
                done();
            });
        });

        it(`should send a 404 code if the floor doesn't exist`, (done) => {
            chai.request(app)
            .delete(`/api/rooms/${config.emptyID}`)
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.has.property('message', 'There was no room with the given ID.');
                done();
            });
        });

        it(`should send a 400 code if the floor ID given isn't valid`, (done) => {
            chai.request(app)
            .delete(`/api/rooms/fakeID`)
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.has.property('message', 'Invalid Room ID');
                done();
            });
        });
    });
});
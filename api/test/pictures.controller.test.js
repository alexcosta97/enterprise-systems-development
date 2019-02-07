const User = require('../models/user.server.model');
const {Property} = require('../models/property.server.model');
const {Floor} = require('../models/floor.server.model');
const Room = require('../models/room.server.model');
const Picture = require('../models/360picture.server.model');
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
let room;
let picture;
let input;
let token;

describe('Pictures Controller', () => {
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
                        title: 'Lovely Property',
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
                                picture = new Picture({
                                    room: room._id,
                                    imageURL : 'http://something.com/pic.png'
                                });
                                picture.save((err, picture) => {
                                    input = {
                                        room: room._id.toString(),
                                        imageURL: 'http://something.com/pic.png'
                                    };
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    describe('Get All Pictures', () => {
        it(`should send an array with all the pictures available for the room`, (done) => {
            chai.request(app)
            .get(`/api/pictures/?room=${room._id.toString()}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body[0]).to.have.property('_id', picture._id.toString());
                done();
            });
        });
    });

    describe('Get Picture', () => {
        it(`should send an object containing the data of a picture`, (done) => {
            chai.request(app)
            .get(`/api/pictures/${picture._id.toString()}`)
            .end((err, res) => {
                expect(res).to.has.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id', picture._id.toString());
                done();
            });
        });

        it(`should send a 404 code if the picture doesn't exist`, (done) => {
            chai.request(app)
            .get(`/api/pictures/${config.emptyID}`)
            .end((err, res) => {
                expect(res).to.has.status(404);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message', 'There was no picture with the given ID.');
                done();
            });
        });

        it(`should send a 400 code if the ID sent isn't valid`, (done) => {
            chai.request(app)
            .get(`/api/pictures/fakeID`)
            .end((err, res) => {
                expect(res).to.has.status(400);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message', `The given ID isn't valid`);
                done();
            });
        });
    });

    // describe('Create Picture', () => {
    //     it(`should send the newly created picture`, (done) => {
    //         chai.request(app)
    //         .post(`/api/pictures/`)
    //         .set('x-auth-token', token)
    //         .attach('picture', fs.readFileSync('./test.png'), 'test.png')
    //         .send(input)
    //         .then(res => {
    //             expect(res).to.have.status(200);
    //             expect(res).to.be.json;
    //             expect(res.body).to.be.an('object');
    //             expect(res.body).to.have.property('room', input.room);
    //             done();
    //         });
    //     });

    //     it(`should send a 400 error if the input is incorrect`, (done) => {
    //         chai.request(app)
    //         .post(`/api/pictures/`)
    //         .set('x-auth-token', token)
    //         .attach('picture', fs.readFileSync('./test.png'), 'test.png')
    //         .then(res => {
    //             expect(res).to.have.status(400);
    //             expect(res).to.be.json;
    //             expect(res.body).to.be.an('object');
    //             expect(res.body).to.have.property('message');
    //             done();
    //         });
    //     });
    // });

    // describe('Update Picture', () => {
    //     it(`should send the newly updated picture if the input is correct`, (done) => {
    //         chai.request(app)
    //         .put(`/api/pictures/${picture._id.toString()}`)
    //         .set('x-auth-token', token)
    //         .attach('picture', fs.readFileSync('./test.png'), 'test.png')
    //         .send(input)
    //         .then(res => {
    //             expect(res).to.has.status(200);
    //             expect(res).to.be.json;
    //             expect(res.body).to.be.an('object');
    //             expect(res.body).to.have.property('_id', picture._id.toString());
    //             done();
    //         });
    //     });

    //     it(`should send a 400 error if the input is incorrect`, (done) => {
    //         chai.request(app)
    //         .put(`/api/pictures/${picture._id.toString()}`)
    //         .set('x-auth-token', token)
    //         .attach('picture', fs.readFileSync('./test.png'), 'test.png')
    //         .then(res => {
    //             expect(res).to.have.status(400);
    //             expect(res).to.be.json;
    //             expect(res.body).to.be.an('object');
    //             expect(res.body).to.have.property('message');
    //             done();
    //         });
    //     });

    //     it(`should send a 404 code if the picture doesn't exist`, (done) => {
    //         chai.request(app)
    //         .put(`/api/pictures/${config.emptyID}`)
    //         .send(input)
    //         .set('x-auth-token', token)
    //         .attach('picture', fs.readFileSync('./test.png'), 'test.png')
    //         .then(res => {
    //             expect(res).to.has.status(404);
    //             expect(res).to.be.json;
    //             expect(res.body).to.be.an('object');
    //             expect(res.body).to.have.property('message', 'There was no picture with the given ID.');
    //             done();
    //         });
    //     });

    //     it(`should send a 400 code if the ID sent isn't valid`, (done) => {
    //         chai.request(app)
    //         .put(`/api/pictures/fakeID`)
    //         .attach('picture', fs.readFileSync('./test.png'), 'test.png')
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

    describe('Delete Picture', () => {
        it(`should send back the picture when given a valid ID`, (done) => {
            chai.request(app)
            .delete(`/api/pictures/${picture._id.toString()}`)
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id', picture._id.toString());
                done();
            });
        });

        it(`should send a 404 code if the picture doesn't exist`, (done) => {
            chai.request(app)
            .delete(`/api/pictures/${config.emptyID}`)
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.has.property('message', 'There was no picture with the given ID.');
                done();
            });
        });

        it(`should send a 400 code if the picture ID given isn't valid`, (done) => {
            chai.request(app)
            .delete(`/api/pictures/fakeID`)
            .set('x-auth-token', token)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.has.property('message', 'Invalid Picture ID');
                done();
            });
        });
    });
});
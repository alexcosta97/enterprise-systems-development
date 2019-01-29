const User = require('../models/user.server.model');
const chai = require('chai');
chai.use(require('chai-jwt'));
const expect = chai.expect;
const mongoose = require('mongoose');
const config = require('../config/config');
const bcrypt = require('bcrypt');

let user;
let input;

describe('Users Model', () => {
    beforeEach((done) => {
        mongoose.connect(config.db, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true});
        mongoose.connection.once('open', () => {
            mongoose.connection.dropDatabase(() => {
                input = {
                    name: 'User Test',
                    email: 'mail@test.com',
                    phone: '12345',
                    password: 'Password'
                };
                user = new User(input);
                done();
            });
        });
    });

    describe('Validate Input', () => {
        it('should validate a correct input object', () => {
            let result = User.validateInput(input);
            expect(result.error).to.be.null;
            expect(result.value).to.not.be.null;
        });

        it(`shouldn't validate the input if one or more member(s) aren't valid`, () => {
            input.email = 'mail';
            let result = User.validateInput(input);
            expect(result.error).to.not.be.null;
        });

        it(`shouldn't validate the input if or more required member(s) are missing`, () => {
            input = {};
            let result = User.validateInput(input);
            expect(result.error).to.not.be.null;
        });
    });

    describe('Validate Login', () => {
        it(`should validate a correct login object`, () => { 
            input = {
                email: 'mail@test.com',
                password: 'Password'
            };
            let result = User.validateLogin(input);
            expect(result.error).to.be.null;
            expect(result.value).to.not.be.null;
        });

        it(`shouldn't validate an incorrect login object`, () => {
            input.email = 'mail';
            let result = User.validateLogin(input);
            expect(result.error).to.not.be.null;
        });

        it(`shouldn't validate a login object with missing members`, () => {
            input = {};
            let result = User.validateLogin(input);
            expect(result.error).to.not.be.null;
        });
    });

    describe('Pre-save Hook', () => {
        it(`should hash the user's password when saving a document`, async () => {
            user.save(async (err, userDB) => {
                expect(err).to.not.exist;
                expect(userDB).to.exist;
                expect(userDB).to.have.property('password');
                
                let result = await bcrypt.compare('Password', userDB.password);
                expect(result).to.be.true;
            });
        });
    });

    describe('Sign Token', () => {
        it(`should sign a JWT for the user`, () => {
            user.save((err, userDB) => {
                expect(err).to.not.exist;
                const token = userDB.signToken();
                expect(token).to.be.a.jwt.and.have.claim('user');
            });
        });
    });
});
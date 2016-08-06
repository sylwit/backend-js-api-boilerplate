import assert from 'assert';
import should from 'should';
import request from 'supertest';
import { givenAsync } from 'mocha-testdata';
import server from '../../../../app';
import {User} from '../../../models/users';
import _ from 'lodash';

const getNormalizePhoneStub = sinon.stub(require('./../../../utils/users.helper').default, 'getNormalizePhone').returnsPromise();

const sequelize_fixtures = require('sequelize-fixtures');

const fakeUser = {
    email: "john.doe@gmail.com",
    phone1: "+1.581.123.4567",
    firstname: "John",
    lastname: "Doe",
    lang: "fr",
    status: "pending",
    pass: "password"
};

describe('controllers', function () {

    describe('users', function () {

        before(async function () {
            await sequelize_fixtures.loadFile('test/fixtures/users.json', {User}, {
                log: () => {
                }
            });
        });

        after(async function () {
            await User.destroy({force: true, where: {}});
        });

        describe('GET /users', function () {
            it('should return a list of X users', function (done) {

                request(server)
                    .get('/users')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.hasOwnProperty('count').be.type('number');
                        res.body.should.hasOwnProperty('rows').be.instanceOf(Array);
                        res.body.count.should.eql(res.body.rows.length);

                        done();
                    });
            });

            it('should filters users', function (done) {

                request(server)
                    .get('/users')
                    .query({
                        limit: 2,
                        sort: 'email|ASC',
                        start: 1,
                        filters: '{"lastname":"%nam%|like"}'
                    })

                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.count.should.equal(3);
                        res.body.rows.should.length(2);
                        res.body.rows[0].id.should.equal('0060d5c6-b6b8-4760-b641-ee15dd7f055b');
                        res.body.rows[1].id.should.equal('d600d776-4a22-4783-9765-0fa89ffe26d4');
                        done();
                    });
            });

            it('should return a specific user', function (done) {

                request(server)
                    .get('/users/0060d5c6-b6b8-4760-b641-ee15dd7f055b')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);

                        res.body.id.should.equal('0060d5c6-b6b8-4760-b641-ee15dd7f055b');
                        res.body.email.should.equal('user1@gmail.com');
                        res.body.lastname.should.equal('Lastname');
                        res.body.firstname.should.equal('Firstname');
                        res.body.company.should.equal('My company');
                        res.body.companyIdentification.should.equal('111-2222-3333');
                        should.equal(res.body.phone1, null);
                        res.body.should.not.have.property('pass');
                        res.body.lang.should.eql("fr");
                        res.body.createdAt.should.not.equal(null);
                        res.body.updatedAt.should.not.equal(null);
                        should.equal(res.body.deletedAt, null);
                        done();
                    });
            });

            it('should return a 404 if user not found', function (done) {
                request(server)
                    .get('/users/aaa-bbb-ccc')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(404)
                    .end(function (err, res) {
                        should.not.exist(err);
                        done();
                    });
            });
        });

        describe('Modify data', function () {

            beforeEach(async function () {
                try {
                    await User.destroy({force: true, where: {}});
                    await sequelize_fixtures.loadFile('test/fixtures/users.json', {User}, {
                        log: () => {
                        }
                    });
                }
                catch (e) {
                    console.log(e);
                }
            });

            describe('POST /users', function () {

                it('should return 400 if one of [ status, lang ] is missing', function (done) {

                    request(server)
                        .post('/users')
                        .send({email: fakeUser.email})
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.body.should.hasOwnProperty('errors').be.instanceOf(Array).and.have.lengthOf(2);
                            done();
                        });
                });

                it('should return 400 if email and phone are missing', function (done) {

                    request(server)
                        .post('/users')
                        .send(
                            _.omit(fakeUser, ['email', 'phone1'])
                        )
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .end(function (err, res) {
                            should.not.exist(err);

                            done();
                        });
                });

                it('should return 400 if password length < 6 ', function (done) {

                    request(server)
                        .post('/users')
                        .send(
                            {
                                email: "newuser@gmail.com",
                                firstname: 'John',
                                lastname: 'Doe',
                                pass: "ab"
                            }
                        )
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .end(function (err, res) {
                            should.not.exist(err);

                            done();
                        });
                });

                it('should create a user', function (done) {

                    fakeUser.company = 'My company';
                    fakeUser.companyIdentification = '123-abc*';

                    getNormalizePhoneStub.resolves({
                        phoneNumber: "+15811234567",
                        countryCode: "CA"
                    });

                    request(server)
                        .post('/users')
                        .send(fakeUser)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(201)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.body.id.should.not.equal(null);
                            res.body.email.should.equal(fakeUser.email);
                            res.body.lastname.should.equal(fakeUser.lastname);
                            res.body.firstname.should.equal(fakeUser.firstname);
                            res.body.company.should.equal(fakeUser.company);
                            res.body.companyIdentification.should.equal(fakeUser.companyIdentification);
                            res.body.phone1.should.equal('+15811234567');
                            res.body.phone1CountryCode.should.equal('CA');

                            res.body.should.not.have.property('pass');
                            res.body.status.should.equal(fakeUser.status);
                            res.body.lang.should.eql(fakeUser.lang);
                            res.body.createdAt.should.not.equal(null);
                            res.body.updatedAt.should.not.equal(null);
                            done();
                        });
                });
                //givenAsync("").test('should return 400 if password length < 6 ', function (done, pass) {});
            });

            describe('PATCH /users/{id}', function () {

                it('should update the 1st user', function (done) {

                    getNormalizePhoneStub.resolves({
                        phoneNumber: '+15811234567',
                        countryCode: "CA"
                    });

                    request(server)
                        .patch('/users/0060d5c6-b6b8-4760-b641-ee15dd7f055b')
                        .send(fakeUser)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end(function (err, res) {
                            should.not.exist(err);

                            res.body.id.should.equal('0060d5c6-b6b8-4760-b641-ee15dd7f055b');
                            res.body.email.should.equal(fakeUser.email);
                            res.body.lastname.should.equal(fakeUser.lastname);
                            res.body.firstname.should.equal(fakeUser.firstname);
                            res.body.phone1.should.equal('+15811234567');
                            res.body.phone1CountryCode.should.equal('CA');
                            res.body.should.not.have.property('pass');
                            res.body.createdAt.should.not.equal(null);
                            res.body.updatedAt.should.not.equal(null);
                            should.equal(res.body.deletedAt, null);
                            done();
                        });
                });

                it('should return 400 if roofing without companyIdentification', function (done) {
                    request(server)
                        .patch('/users/0060d5c6-b6b8-4760-b641-ee15dd7f055b')
                        .send({
                            roofing: true,
                            companyIdentification: ""
                        })
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .end(function (err, res) {
                            should.not.exist(err);
                            done();
                        });
                });

                givenAsync("", null).test('should return 400 if user removes email and phone', function (done, value) {
                    request(server)
                        .patch('/users/0060d5c6-b6b8-4760-b641-ee15dd7f055b')
                        .send({email: value, phone1: value})
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .end(function (err, res) {
                            should.not.exist(err);
                            done();
                        });
                });

                it('should return 400 if email is already used by another user', function (done) {

                    request(server)
                        .patch('/users/0060d5c6-b6b8-4760-b641-ee15dd7f055b')
                        .send(
                            {
                                email: "user3@gmail.com"
                            }
                        )
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .end(function (err, res) {
                            should.not.exist(err);
                            done();
                        });
                });

                it('should return 400 if phone is already used by another user', function (done) {

                    getNormalizePhoneStub.resolves({
                        phoneNumber: "+14189999999",
                        countryCode: "CA"
                    });

                    request(server)
                        .patch('/users/0060d5c6-b6b8-4760-b641-ee15dd7f055b')
                        .send({phone1: "+1.418.999.9999"})
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .end(function (err, res) {
                            should.not.exist(err);
                            done();
                        });
                });

                it('should return 400 if password length < 6 ', function (done) {

                    request(server)
                        .patch('/users/0060d5c6-b6b8-4760-b641-ee15dd7f055b')
                        .send({pass: "ab"})
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .end(function (err, res) {
                            should.not.exist(err);

                            done();
                        });
                });

                it('should return 400 if phone is not found by twilio', function (done) {

                    getNormalizePhoneStub.rejects(new Error('nop'));

                    request(server)
                        .patch('/users/0060d5c6-b6b8-4760-b641-ee15dd7f055b')
                        .send({phone1: "+1.418.999.9999"})
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.body.message.should.eql('nop');
                            done();
                        });
                });

            });

            describe('DELETE /users/{id}', function () {
                it('should delete the 1st user', function (done) {

                    request(server)
                        .delete('/users/0060d5c6-b6b8-4760-b641-ee15dd7f055b')
                        .set('Accept', 'application/json')
                        .expect(204, "")
                        .end(function (err, res) {
                            should.not.exist(err);

                            User.findById('0060d5c6-b6b8-4760-b641-ee15dd7f055b').then(function (data) {
                                should.equal(data, null);
                                done();
                            });
                        });
                });
            });
        });


    });


});

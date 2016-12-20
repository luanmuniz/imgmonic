'use strict';

const lab = exports.lab = require('lab').script();
const expect = require('code').expect;
const helper = require('./helper');
const yaml = require('node-yaml');
const NODE_ENV = process.env.NODE_ENV || 'development';
const config = yaml.readSync('../config.yml')[NODE_ENV];
const routerLib = require('../src/routes')(helper.server, config);

lab.describe('isHashValid', () => {

	lab.test('isHashValid valid', done => {
		const base64Hash = helper.encodeUrl('http://google.com', 'aVerySecretSecret');
		const isHashValid = routerLib.isHashValid(base64Hash, 'http://google.com');

		expect(isHashValid)
			.to.be.an.boolean()
			.and.to.be.true();

		done();
	});

	lab.test('isHashValid without hash param', done => {
		const isHashValid = routerLib.isHashValid(null, 'http://google.com');

		expect(isHashValid)
			.to.be.an.boolean()
			.and.to.be.false();

		done();
	});

	lab.test('isHashValid without url param', done => {
		const base64Hash = helper.encodeUrl('http://google.com', 'aVerySecretSecret');
		const isHashValid = routerLib.isHashValid(base64Hash);

		expect(isHashValid)
			.to.be.an.boolean()
			.and.to.be.false();

		done();
	});

	lab.test('isHashValid with the wrong URL when checking', done => {
		const base64Hash = helper.encodeUrl('http://google.com', 'aVerySecretSecret');
		const isHashValid = routerLib.isHashValid(base64Hash, 'http://googles.com');

		expect(isHashValid)
			.to.be.an.boolean()
			.and.to.be.false();

		done();
	});

	lab.test('isHashValid with the wrong url when building the hash', done => {
		const base64Hash = helper.encodeUrl('http://google.coms', 'aVerySecretSecret');
		const isHashValid = routerLib.isHashValid(base64Hash, 'http://google.com');

		expect(isHashValid)
			.to.be.an.boolean()
			.and.to.be.false();

		done();
	});

	lab.test('isHashValid with the wrong secret', done => {
		const base64Hash = helper.encodeUrl('http://google.com', 'aVerySecretSecrets');
		const isHashValid = routerLib.isHashValid(base64Hash, 'http://google.com');

		expect(isHashValid)
			.to.be.an.boolean()
			.and.to.be.false();

		done();
	});

});
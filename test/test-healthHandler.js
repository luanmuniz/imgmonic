'use strict';

const lab = exports.lab = require('lab').script();
const expect = require('code').expect;
const helper = require('./helper');
const yaml = require('node-yaml');
const NODE_ENV = process.env.NODE_ENV || 'development';
const config = yaml.readSync('../config.yml')[NODE_ENV];
const routerLib = require('../src/routes')(helper.server, config);

lab.describe('healthHandler', () => {

	lab.test('healthHandler return correct value', done => {
		const healthReturn = routerLib.healthHandler(null, helper.reply);

		expect(healthReturn.content)
			.to.be.an.object()
			.and.to.only.include({ ok: 'ok' });

		done();
	});

});
'use strict';

const got = require('got');
const crypto = require('crypto');

var routeObj = {

	init(server, config) {
		routeObj.config = config;

		server.route({
			method: 'GET',
			path: '/health',
			handler: routeObj.healthHandler
		});

		server.route({
			method: 'GET',
			path: '/i/{hash}',
			handler: routeObj.getImagesHandler
		});
	},

	healthHandler(req, reply) {
		return reply({ ok: 'ok' });
	},

	getImagesHandler(req, reply) {
		const base64Hash = encodeURIComponent(req.params.hash);
		let url = encodeURIComponent(req.query.url || '');

		if(!routeObj.isHashValid(base64Hash, url)) {
			url = routeObj.config.placeholder;
		}

		return got(url)
			.then((response) => routeObj.replyImage(response, reply));
	},

	replyImage(res, reply) {
		if(res.headers['content-length'] && parseInt(res.headers['content-length'], 10) !== res.body.length) {
			return got(res.requestUrl, { encoding: 'buffer' })
				.then((gotRes) => routeObj.replyImage(gotRes, reply));
		}

		return reply(res.body)
			.type(res.headers['content-type']);
	},

	isHashValid(base64Hash, url) {
		if(!base64Hash || !url) {
			return false;
		}

		const internalHash = crypto.createHmac('sha256', routeObj.config.secret)
			.update(url)
			.digest('base64');

		return (base64Hash === internalHash);
	}

};

module.exports = routeObj.init;
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const zlib = require('zlib');
const got = require('got');

var Helper = {

	reply(content) {
		return {
			content: content,
			type(type) { return Helper.reply(content) }
		};
	},

	encodeUrl(url, secret) {
		return crypto.createHmac('sha256', secret)
			.update(url)
			.digest('base64');
	},

	getImageContent(url) {
		return got(url);
	},

	server: {
		route(content) {
			return content;
		}
	}

};

module.exports = Helper;
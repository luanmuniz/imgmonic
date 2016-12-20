'use strict';

const yaml = require('node-yaml');
const hapiTest = require('hapi-test');
const lab = exports.lab = require('lab').script();
const expect = require('code').expect;

const helper = require('./helper');
const NODE_ENV = process.env.NODE_ENV || 'development';
const config = yaml.readSync('../config.yml')[NODE_ENV];
const server = require('../src/index');

lab.describe('getImagesHandler', () => {
	const finalImage = 'https://placeholdit.imgix.net/~text?txtsize=5&txt=10%C3%9710&w=10&h=10&txtpad=1';
	const placeholderImage = 'https://placeholdit.imgix.net/~text?txtsize=33&txt=350%C3%97150&w=350&h=150';
	const realNotBufferImage = 'https://use.zimp.me/images/partners/centauro.png';

	const placeHolderRequestWithBuffer = helper.getImageContent(placeholderImage);
	const finalImageRequestWithBuffer = helper.getImageContent(finalImage);
	const realBufferImageRequest = helper.getImageContent(realNotBufferImage);

	lab.test('getImagesHandler returning a valid image', { timeout: 10000 }, done => {
		const url = encodeURIComponent(finalImage);
		const hash = encodeURIComponent(helper.encodeUrl(finalImage, config.secret));

		hapiTest({ server })
			.get(`/i/${hash}?url=${url}`)
			.end(function(result) {
		        expect(result.statusCode).to.be.equal(200);
		        expect(result.headers['content-type']).to.be.equal('image/png');

				finalImageRequestWithBuffer.then((finalImageResult) => {
					expect(result.result).to.be.equal(finalImageResult.body.toString());
		        	done();
				});
		    });
	});

	lab.test('getImagesHandler returning a valid image without buffer', { timeout: 10000 }, done => {
		const url = encodeURIComponent(realNotBufferImage);
		const hash = encodeURIComponent(helper.encodeUrl(realNotBufferImage, config.secret));

		hapiTest({ server })
			.get(`/i/${hash}?url=${url}`)
			.end(function(result) {
		        expect(result.statusCode).to.be.equal(200);
		        expect(result.headers['content-type']).to.be.equal('image/png');

				realBufferImageRequest.then((finalImageResult) => {
					expect(result.result).to.be.equal(finalImageResult.body.toString());
		        	done();
				}).catch(console.log);
		    });
	});

	lab.test('getImagesHandler returning a placeholder image because imagem doesn\'t exist', { timeout: 10000 }, done => {
		const url = encodeURIComponent('https://luanmuniz.com.br/asd');
		const hash = encodeURIComponent(helper.encodeUrl('https://luanmuniz.com.br/asd', config.secret));

		hapiTest({ server })
			.get(`/i/${hash}?url=${url}`)
			.end(function(result) {
		        expect(result.statusCode).to.be.equal(200);
		        expect(result.headers['content-type']).to.be.equal('image/png');

				placeHolderRequestWithBuffer.then((finalImageResult) => {
					expect(result.result).to.be.equal(finalImageResult.body.toString());
		        	done();
				}).catch(console.log);
		    });
	});

	lab.test('getImagesHandler returning a placeholder image because url is not an image', { timeout: 10000 }, done => {
		const url = encodeURIComponent('https://luanmuniz.com.br/');
		const hash = encodeURIComponent(helper.encodeUrl('https://luanmuniz.com.br/', config.secret));

		hapiTest({ server })
			.get(`/i/${hash}?url=${url}`)
			.end(function(result) {
		        expect(result.statusCode).to.be.equal(200);
		        expect(result.headers['content-type']).to.be.equal('image/png');

				placeHolderRequestWithBuffer.then((finalImageResult) => {
					expect(result.result).to.be.equal(finalImageResult.body.toString());
		        	done();
				}).catch(console.log);
		    });
	});

	lab.test('getImagesHandler returning a placeholder because no url was sent', { timeout: 10000 }, done => {
		const url = encodeURIComponent(finalImage);
		const hash = encodeURIComponent(helper.encodeUrl(finalImage, config.secret));

		hapiTest({ server })
			.get(`/i/${hash}`)
			.end(function(result) {
		        expect(result.statusCode).to.be.equal(200);
		        expect(result.headers['content-type']).to.be.equal('image/png');

				placeHolderRequestWithBuffer.then((placeholderResult) => {
					expect(result.result).to.be.equal(placeholderResult.body.toString());
		        	done();
				});
		    });
	});

	lab.test('getImagesHandler returning a placeholder because the url was wrong', { timeout: 10000 }, done => {
		const url = encodeURIComponent(placeholderImage);
		const hash = encodeURIComponent(helper.encodeUrl(finalImage, config.secret));

		hapiTest({ server })
			.get(`/i/${hash}`)
			.end(function(result) {
		        expect(result.statusCode).to.be.equal(200);
		        expect(result.headers['content-type']).to.be.equal('image/png');

				placeHolderRequestWithBuffer.then((placeholderResult) => {
					expect(result.result).to.be.equal(placeholderResult.body.toString());
		        	done();
				});
		    });
	});

	lab.test('getImagesHandler returning a placeholder because the hash is incorrect', { timeout: 10000 }, done => {
		const url = encodeURIComponent(finalImage);
		const hash = encodeURIComponent(helper.encodeUrl(placeholderImage, config.secret));

		hapiTest({ server })
			.get(`/i/${hash}?url=${url}`)
			.end(function(result) {
		        expect(result.statusCode).to.be.equal(200);
		        expect(result.headers['content-type']).to.be.equal('image/png');

				placeHolderRequestWithBuffer.then((placeholderResult) => {
					expect(result.result).to.be.equal(placeholderResult.body.toString());
		        	done();
				});
		    });
	});

});
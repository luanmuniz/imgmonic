'use strict';

const yaml = require('node-yaml');
const Hapi = require('hapi');
const server = new Hapi.Server();

/* $lab:coverage:off$ */
const NODE_ENV = process.env.NODE_ENV || 'development';
const config = yaml.readSync('../config.yml')[NODE_ENV];
/* $lab:coverage:on$ */

server.connection(config.app);
require('./routes')(server, config);

server.start(() => {
    console.log('Server running at:', server.info.uri);
});

module.exports = server;

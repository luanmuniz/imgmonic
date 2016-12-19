'use strict';

const yaml = require('node-yaml');
const Hapi = require('hapi');
const server = new Hapi.Server();

const NODE_ENV = process.env.NODE_ENV || 'development';
const config = yaml.readSync('../config.yml')[NODE_ENV];

server.connection(config.app);
require('./routes')(server, config);

server.start(() => {
    console.log('Server running at:', server.info.uri);
});

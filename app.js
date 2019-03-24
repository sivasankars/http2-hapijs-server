'use strict';

const Hapi = require('hapi');
const http2 = require('http2');
const fs = require('fs');
const path = require('path');
const Inert = require('inert');

var httpsOptions = {
    'key': fs.readFileSync(__dirname + '/server.key'),
    'cert': fs.readFileSync(__dirname + '/server.crt'),
    'ca': fs.readFileSync(__dirname + '/server.crt')
};

const server = Hapi.server({
    listener: http2.createSecureServer(httpsOptions),
    port: 3000,
    host: 'localhost',
});

const init = async () => {

    await server.register(Inert);


    server.route({
        method: 'GET',
        path: '/public/{param*}',
        handler: {
            directory: {
                path: './public',
                listing: true
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.file('./public/index.html');
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
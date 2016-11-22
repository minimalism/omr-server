'use strict';

const Hapi = require('hapi');
const Routes = require('./routes');

const server = new Hapi.Server();

server.connection({ 
    host: 'localhost', 
    port: 8000 
});
server.route(Routes.endpoints);

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
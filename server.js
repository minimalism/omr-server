'use strict';

const Hapi = require('hapi');
const Routes = require('./backend/routes');

const server = new Hapi.Server();

server.connection({ 
    host: 'localhost', 
    port: 8000 
});
server.route(Routes.endpoints);

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);

    var firebase = require('firebase');
    var firebaseConfig = require('./backend/config/firebase.js');

    firebase.initializeApp(firebaseConfig);
});
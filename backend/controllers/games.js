var firebase = require('firebase');

exports.create = {
    handler: (request, reply) => {

        var user = firebase.auth().currentUser;
        if (user){
            var database = firebase.database();

            var gameData = {
                name: request.payload.name,
                host: user.uid,
                status: 0
            };

            var newGameKey = database.ref().child('games').push().key;

            var update = {};
            update['games/' + newGameKey] = gameData;
            database.ref().update(update).then((response) => {
                reply({ gameId : newGameKey });
            }, (fail) => {
                reply({ error : fail });
            });
        }
        else reply('Please log in.').code(401);
    }
}

exports.list = {
    handler: (request, reply) => {

        firebase.database().ref('/games').once('value').then(function(snapshot){
            reply(
                { games : snapshot.val() }
            ).code(200);
        });
    }
}

exports.displayForm = {
    handler: function(request, reply) {
        reply(
            '<form action="/games" method="post">' +
            '<label><b>Game name</b></label>' +
            '<input type="text" placeholder="Enter game name" name="name" required>' +
            '<input type="submit" value="Create">' +
            '</form>'
        );
    }
};
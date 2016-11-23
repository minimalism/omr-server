var firebase = require('firebase');

exports.login = {
    handler: (request, reply) => {

        var email = request.payload.email;
        var password = request.payload.password;

        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            reply(error.message);
        });
        
        reply('Welcome!');
    }
}

exports.displayLoginForm = {
    handler: function(request, reply) {
        reply(
            '<form action="/login" method="post">' +
            '<label><b>Email</b></label>' +
            '<input type="text" placeholder="Enter Email" name="email" required>' +
            '<label><b>Password</b></label>' +
            '<input type="password" placeholder="Enter Password" name="password" required>' +
            '<input type="submit" value="Login">' +
            '</form>'
        );
    }
};

exports.register = {
    handler: (request, reply) => {

        var email = request.payload.email;
        var password = request.payload.password;

        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            if (error.message) reply(error.message);
            else { reply('Welcome aboard!'); }
        });
    }
}

exports.displayRegisterForm = {
    handler: function(request, reply) {
        reply(
            '<form action="/register" method="post">' +
            '<label><b>Username</b></label>' +
            '<input type="text" placeholder="Enter Email" name="email" required>' +
            '<label><b>Password</b></label>' +
            '<input type="password" placeholder="Enter Password" name="password" required>' +
            '<input type="submit" value="Register">' +
            '</form>'
        );
    }
};

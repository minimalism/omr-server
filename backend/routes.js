var Download = require('./controllers/download'),
    Upload = require('./controllers/upload'),
    Auth = require('./controllers/auth'),
    Games = require('./controllers/games'),
    Config = require('./config/config');

exports.endpoints = [
    { method: 'GET', path: Config.downloadEndpoint + '/{file}', config: Download.getFile },

    { method: 'GET', path: Config.uploadEndpoint, config: Upload.displayForm },
    { method: 'POST', path: Config.uploadEndpoint, config: Upload.postFile },

    { method: 'GET', path: Config.loginEndpoint, config: Auth.displayLoginForm },
    { method: 'POST', path: Config.loginEndpoint, config: Auth.login },

    { method: 'GET', path: Config.registerEndpoint, config: Auth.displayRegisterForm },
    { method: 'POST', path: Config.registerEndpoint, config: Auth.register },

    { method: 'GET', path: Config.gamesEndpoint, config: Games.list },
    { method: 'GET', path: Config.gamesEndpoint + '/form', config: Games.displayForm },
    { method: 'POST', path: Config.gamesEndpoint, config: Games.create },    

];
var Download = require('./controllers/download'),
    Upload = require('./controllers/upload'),
    Config = require('./config/config');

exports.endpoints = [
    { method: 'GET', path: Config.downloadEndpoint + '/{file}', config: Download.getFile },
    { method: 'POST', path: Config.uploadEndpoint, config: Upload.postFile },
];
var Download = require('./download'),
    Upload = require('./upload'),
    Config = require('./config');

exports.endpoints = [
    { method: 'GET', path: Config.downloadEndpoint + '/{file}', config: Download.getFile },
    { method: 'GET', path: Config.uploadEndpoint, config: Upload.displayForm },
    { method: 'POST', path: Config.uploadEndpoint, config: Upload.postFile },
];
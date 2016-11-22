var fs = require('fs'),
    Config = require('./config');

exports.getFile = {
    handler: function(request, reply) {
        var fileName = request.params.file + '.' + Config.allowedExt;
        var path = Config.savesDir + fileName;
        fs.readFile(path, function(error, content){
            if (error) return reply('Game not found');
            return reply(content).header('Content-Type', 'application/octet-stream').header('Content-Disposition', 'attachment; filename=' + fileName);
        });
    }
}
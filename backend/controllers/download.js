const fs = require('fs'),
      Config = require('../config/config');

exports.getFile = {
    handler: function(request, reply) {
        const fileName = `${request.params.file}.${Config.allowedExt}`;
        const path = Config.savesDir + fileName;
        fs.readFile(path, function(error, content){
            if (error) return reply('Game not found');
            return reply(content).header('Content-Type', 'application/octet-stream').header('Content-Disposition', `attachment; filename=${fileName}`);
        });
    }
}
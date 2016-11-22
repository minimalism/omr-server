var fs = require('fs'),
    multiparty = require('multiparty'),
    Config = require('./config');

exports.postFile = {
    payload: {
        maxBytes: 209715200,
        output: 'stream',
        parse: false
    },
    handler: (request, reply) => {
        var form = new multiparty.Form();
        form.parse(request.payload, (err, fields, files) => {
            if (err) return reply(err);
            else {
                fs.readFile(files.file[0].path, (err, data) => {
                    fs.stat(Config.savesDir, (err, stats) => {

                        // Handle missing directory, fail on other errors
                        if (err){
                            if (err.code == 'ENOENT') fs.mkdirSync(Config.savesDir);
                            else return reply(err);
                        }

                        var fName = files.file[0].originalFilename,
                        dest = Config.savesDir + fName,
                        ext = fName.substr(fName.lastIndexOf('.') + 1);

                        if (ext == Config.allowedExt){
                            fs.writeFile(dest, data, (err) => {
                                if (err) return reply(err);
                                else {
                                    var link = request.headers.origin
                                        + Config.downloadEndpoint + "/"
                                        + fName.substr(0, fName.lastIndexOf('.'));
                                    return reply('<p>Thanks! Provide this download link for the next player:</p><pre>'
                                        + link 
                                        + '</pre>');
                                };
                            });
                        }
                        else return reply('Invalid savefile');
                    });
                });
            }
        });
    }
}

exports.displayForm = {
    handler: function(request, reply) {
        reply(
            '<form action="/upload" method="post" enctype="multipart/form-data">' +
            '<input type="file" name="file">' +
            '<input type="submit" value="Upload">' +
            '</form>'
        );
    }
};

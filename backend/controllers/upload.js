var fs = require('fs'),
    multiparty = require('multiparty'),
    firebase = require('firebase'),
    _ = require('lodash'),
    //civ6 = require('civ6-save-parser'),
    crypto = require('crypto'),
    Config = require('../config/config');

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
            
            fs.readFile(files.file[0].path, (err, data) => {
                fs.stat(Config.savesDir, (err, stats) => {

                    // Handle missing directory, fail on other errors
                    if (err){
                        if (err.code == 'ENOENT') fs.mkdirSync(Config.savesDir);
                        else return reply(err).code(500);
                    }

                    const gameId = fields.gameId[0];
                    const participantId = fields.participantId[0];

                    const fName = files.file[0].originalFilename,
                          ext = fName.substr(fName.lastIndexOf('.') + 1);

                    if (ext != Config.allowedExt) return reply('Invalid savefile').code(500);  // Invalid file extension

                    // Verify that current user had latest turn: 
                    firebase.database().ref().child(`/games/${gameId}`).once('value').then(snapshot => {
                        const gameData = snapshot.val();

                        // Create a new turn
                        let update = {};

                        // Game status must be "Started"
                        if (gameData.status != 1) return reply(`Expected status 1, found ${gameData.status}`).code(500);

                        // Sort participants by turn order
                        const participants = _(gameData.participants)
                            .map((value, participantId) => { 
                                return { participantId : participantId, ordinal : value.ordinal, userId : value.userId } 
                            })
                            .orderBy('ordinal').value();

                        let previousParticipantId = participants[0].participantId;
                        let turnNumber = 0;
                        if (gameData.latestTurn != undefined){
                            turnNumber = gameData.latestTurn + 1;
                            previousParticipantId = gameData.nextTurner; 
                        }

                        if (participantId != previousParticipantId) return reply(`It's not your turn!`).code(500); 

                        const previousTurnerIndex = Math.max(0, _.findIndex(participants, ['participantId', gameData.nextTurner]));
                        const nextTurnerIndex = (previousTurnerIndex + 1) % participants.length;
                        const nextTurner = participants[nextTurnerIndex];

                        // The id with which clients will be able to look up the save file
                        const targetFilename = `${gameId}-${turnNumber}`;

                        /*if (Config.scramblePasswords){
                            try {
                                const parsed = civ6.parse(data);
                                data = civ6.modifyCiv(data, parsed.CIVS[nextTurnerIndex], { PLAYER_PASSWORD: "" });
                                const randomString = crypto.randomBytes(8).toString('hex');
                                data = civ6.modifyCiv(data, parsed.CIVS[previousTurnerIndex], { PLAYER_PASSWORD: randomString });
                            }
                            catch(err) {
                                console.error(`Unable to modify player password: ${err}`);
                            }
                        }*/

                        // Everything checks out, write save file to disk
                        fs.writeFile(`${Config.savesDir}${targetFilename}.${Config.allowedExt}`, data, (err) => {
                            if (err) return reply(err).code(500);

                            // Commit turn to firebase
                            const turnData = {
                                participantId: participantId,
                                fileId: `${targetFilename}`,
                                submitted: Date.now()
                            };

                            update[`/games/${gameId}/latestTurn`] = turnNumber;
                            update[`/games/${gameId}/nextTurner`] = nextTurner.participantId;
                            update[`/turns/${gameId}/${turnNumber}`] = turnData;

                            firebase.database().ref().update(update).then(() => {
                                return reply().code(200);
                            }, (fail) => {
                                return reply(fail.message).code(500);
                            });
                        });
                    });
                });
            });
            
        });
    }
}

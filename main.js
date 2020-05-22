var roomMod = require('room');

module.exports.loop = function(){
    command = null;
    for (let name in Game.rooms){
        let room = Game.rooms[name];
        roomMod.run(room, command);
    }
};

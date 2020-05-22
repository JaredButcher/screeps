var MRoomRunner = require('room');
var MCreepUtil = require('creepUtil');
var MSuperviser = require('superviser')

module.exports.loop = function(){
    MSuperviser.run();
    for (let room of Game.rooms){
        MRoomRunner.run(room);
    }
    for (let creep of Game.creeps){
        MCreepUtil.processCommand(creep);
    }
};

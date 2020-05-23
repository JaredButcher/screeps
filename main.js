var MCreepCommands = require('creepCommands');
var MSuperviser = require('superviser');
var MRoomRunner = require('roomRunner');

module.exports.loop = function(){
    if(!Memory.inited){
        Memory.inited = true;
        Memory.lifetimeCreepSpawnCount = Math.floor(Math.random() * 100000);
    }
    MSuperviser.run();
    for (let room in Game.rooms){
        MRoomRunner.run(Game.rooms[room]);
    }
    for (let creep in Game.creeps){
        MCreepCommands.manage.processCommand(Game.creeps[creep]);
    }
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
};

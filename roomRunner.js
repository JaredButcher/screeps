let MRoomUtils = require('roomUtil');

//Decide on what should be done in this room
function updateRoom(room){
    let newLevel = room.memory.lastLevel != room.controller.level;
    room.memory.lastLevel = room.controller.level;
    switch(room.controller.level){
        case 0:
            //Todo: summon creeps from other rooms
        break;
        case 1:
            if(newLevel){
                //Target creep counts
                room.memory.taskAssigns["REPAIR"].max = 1;
                room.memory.taskAssigns["UPGRADE"].max = Object.keys(room.memory.goals.sources).length;
                room.memory.taskAssigns["TRANSPORT"].max = 0;
                room.memory.taskAssigns["BUILD"].max = 2;
                //Build new buildings
                buildStructureNear(room, room.controller.pos, STRUCTURE_SPAWN);
                for(let spawn of room.memory.spawns){
                    //Place containers
                    //Place roads
                    //if(spawn.road)
                }
            }
        break;
        case 2:
            if(newLevel){
                //Target creep counts
                room.memory.taskAssigns["REPAIR"].max = 1;
                room.memory.taskAssigns["UPGRADE"].max = Object.keys(room.memory.goals.sources).length;
                room.memory.taskAssigns["TRANSPORT"].max = 0;
                room.memory.taskAssigns["BUILD"].max = 2;
                //Build new buildings
            }
        break;
        case 3:
            if(newLevel){
                //Target creep counts
                room.memory.taskAssigns["REPAIR"].max = 1;
                room.memory.taskAssigns["UPGRADE"].max = Object.keys(room.memory.goals.sources).length;
                room.memory.taskAssigns["TRANSPORT"].max = 0;
                room.memory.taskAssigns["BUILD"].max = 2;
                //Build new buildings
            }
        break;
        case 4:
            if(newLevel){
                //Target creep counts
                room.memory.taskAssigns["REPAIR"].max = 1;
                room.memory.taskAssigns["UPGRADE"].max = Object.keys(room.memory.goals.sources).length;
                room.memory.taskAssigns["TRANSPORT"].max = 0;
                room.memory.taskAssigns["BUILD"].max = 2;
                //Build new buildings
            }
        break;
        case 5:
            if(newLevel){
                //Target creep counts
                room.memory.taskAssigns["REPAIR"].max = 1;
                room.memory.taskAssigns["UPGRADE"].max = Object.keys(room.memory.goals.sources).length;
                room.memory.taskAssigns["TRANSPORT"].max = 0;
                room.memory.taskAssigns["BUILD"].max = 2;
                //Build new buildings
            }
        break;
        case 6:
            if(newLevel){
                //Target creep counts
                room.memory.taskAssigns["REPAIR"].max = 2;
                room.memory.taskAssigns["UPGRADE"].max = Object.keys(room.memory.goals.sources).length;
                room.memory.taskAssigns["TRANSPORT"].max = 0;
                room.memory.taskAssigns["BUILD"].max = 2;
                //Build new buildings
            }
        break;
        case 7:
            if(newLevel){
                //Target creep counts
                room.memory.taskAssigns["REPAIR"].max = 2;
                room.memory.taskAssigns["UPGRADE"].max = Object.keys(room.memory.goals.sources).length;
                room.memory.taskAssigns["TRANSPORT"].max = 0;
                room.memory.taskAssigns["BUILD"].max = 2;
                //Build new buildings
            }
        break;
        case 8:
            if(newLevel){
                //Target creep counts
                room.memory.taskAssigns["REPAIR"].max = 2;
                room.memory.taskAssigns["UPGRADE"].max = 1;
                room.memory.taskAssigns["TRANSPORT"].max = 0;
                room.memory.taskAssigns["BUILD"].max = 2;
                //Build new buildings
            }
        break;
    }
}

var roomRunner = {
    run: function(room){
        if(room.controller.my){
            MRoomUtils.initRoom(room);
            updateRoom(room);

            //Find hostiles and enter defcon
            if(room.memory.defcon > 0){
                let hostiles = room.find(FIND_HOSTILE_CREEPS);
                if(hostiles.length > 0){
                    let towers = room.find(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_TOWER});
                    for(let tower of towers){
                        /*let damagedStructure = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL });
                        if(damagedStructure){
                            tower.repair(damagedStructure);
                        }*/
                        let enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                        if(enemy && tower.pos.inRangeTo(enemy.pos, 20)){
                            tower.attack(enemy);
                            if(room.memory.defcon == 1) room.memory.defcon = 2;
                        }
                    }
                }else{
                    room.memory.defcon = 0;
                }
            }
            for(let i = 0; i < room.memory.actionsPerTick; ++i){
                MRoomUtils.processJob(room);
            }   
        }
    }
};

module.exports = roomRunner;

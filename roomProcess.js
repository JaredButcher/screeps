let roleMod = require('role');

const TIMER_STATES = 1;

//0-storage doesn't exist, 1-storage placed, 2 - storage working / assigned creeps / road placed
const SOURCE_GOALS = {
    STORAGE: 0,
    CREEPS: 1,
    ROAD_PLACED: 2
}

//Decide on what should be done in this room
function setGoals(room){
    if(room.memory.goals.lastLevel != room.controller.level){
        //Create roads to sources if they don't exist
        
    }
    switch(room.controller.level){
        case 0:
            //Todo: summon creeps from other rooms
        break;
        case 1:
            if(!room.memory.goals.lastLevel != room.controller.level){
                room.memory.goals.lastLevel = room.controller.level;
                //Target creep counts
                room.memory.goals.creeps["HARVESTER"][1] = Object.keys(room.memory.goals.sources).length;
                room.memory.goals.creeps["BUILDER"][1] = Object.keys(room.memory.goals.sources).length;
                //room.memory.goals.creeps["UPGRADER"][1] = room.memory.goals.sources.length;
                //Build new buildings
                buildStructureNear(room, room.controller.pos, STRUCTURE_SPAWN);
            }
        break;
        case 2:
            if(!room.memory.goals.lastLevel != room.controller.level){
                room.memory.goals.lastLevel = room.controller.level;
                //Target creep counts
                room.memory.goals.creeps["HARVESTER"][1] = Object.keys(room.memory.goals.sources).length;
                room.memory.goals.creeps["BUILDER"][1] = Object.keys(room.memory.goals.sources).length;
                //room.memory.goals.creeps["UPGRADER"][1] = room.memory.goals.sources.length;
                //Build new buildings
                buildStructureNear(room, room.controller.pos, STRUCTURE_SPAWN);
            }
        break;
        case 3:
        break;
        case 4:
        break;
        case 5:
        break;
        case 6:
        break;
        case 7:
        break;
        case 8:
        break;
    }
}

var roomProcess = {
    run: function(room, command){
        if(room.controller.my){
            initMemory(room);
            setGoals(room);

            //Find commonly needed entities
            let hostiles = room.find(FIND_HOSTILE_CREEPS);
            let creeps = room.find(FIND_MY_CREEPS);
            let spawns = room.find(FIND_MY_SPAWNS);

            if(hostiles.length > 0){
                let towers = room.find(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_TOWER});
                for(let tower in towers){
                    /*let damagedStructure = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL });
                    if(damagedStructure){
                        tower.repair(damagedStructure);
                    }*/
                    let enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    if(enemy && tower.pos.inRangeTo(enemy.pos, 20)){
                        tower.attack(enemy);
                    }
                }
            }

            let currentCreeps = {};
            for(let creep of creeps){
                if(currentCreeps[creep.memory.role]){
                    currentCreeps[creep.memory.role] += 1;
                }else{
                    currentCreeps[creep.memory.role] = 1;
                }
            }
            for(let creepType in room.memory.goals.creeps){
                console.log(creepType + " " + currentCreeps[creepType]);
                if((room.memory.goals.creeps[creepType][1] > 0 && !currentCreeps[creepType]) || room.memory.goals.creeps[creepType][1] > currentCreeps[creepType]){
                    let d = new Date();
                    if(spawns[0].spawnCreep(roleMod.roles[creepType].body[0][1], creepType + Math.random() * d.getTime(), {memory: {role: creepType, task: "MINE"}}) == OK){
                        room.memory.goals.creeps[creepType][0] += 1;
                    }
                }
            }

            for(let creep of creeps){
                roleMod.roles[creep.memory.role].run(creep);
            }

            room.memory.timerState = room.memory.timerState + 1 % TIMER_STATES;
        }
    }
};

module.exports = roomProcess;
//Towers
//Build
//Etc

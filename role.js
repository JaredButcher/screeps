class Role{
    constructor(run, body){
        this.run = run;
        this.body = body;
    }
}

const TASKS = {
    GOTO: 0,
    WORK: 1,
    RETURN: 2,
    FETCH: 3
}

const Roles = {
    HARVESTER: new Role(function(creep){
            if(creep.memory.task == "MINE"){
                console.log(0);
                if(creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
                    creep.memory.task = "TRANSFER";
                    Roles.HARVESTER.run(creep);
                }else{
                    let sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }else{
                        creep.harvest(sources[0]);
                    }
                }
            }else if(creep.memory.task == "TRANSFER"){
                console.log(2);
                if(creep.store[RESOURCE_ENERGY] == 0){
                    creep.memory.task = "MINE";
                    Roles.HARVESTER.run(creep);
                }else{
                    let stoarages = creep.room.find(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER});
                    if(stoarages.length > 0){
                        if(creep.pos != storeages[0].pos){
                            creep.moveTo(stoarages[0].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
                        }else{
                            creep.drop(RESOURCE_ENERGY);
                        }
                    }else{
                        let spawns = creep.room.find(FIND_MY_STRUCTURES, { filter: (structure) => 
                            (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
                        if(spawns.length > 0){
                            if(creep.transfer(spawns[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                                creep.moveTo(spawns[0].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
                            }
                        }else{
                            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                                creep.moveTo(creep.room.controller.pos, {visualizePathStyle: {stroke: '#ffaa00'}});
                            }
                        }
                    }
                }
            }else{
                console.log(1);
                creep.memory.task = "MINE";
            }
        },
            [[300, [MOVE, MOVE, WORK, CARRY, CARRY]]]
    ),
    UPGRADER: function(creep){

    },
    FIGHTER: function(creep){

    },
    CLAIMER: function(creep){

    },
    BUILDER: new Role(function(creep){
            if(creep.memory.task == "MINE"){
                console.log(0);
                if(creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
                    creep.memory.task = "TRANSFER";
                    Roles.HARVESTER.run(creep);
                }else{
                    let sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }else{
                        creep.harvest(sources[0]);
                    }
                }
            }else if(creep.memory.task == "TRANSFER"){
                console.log(2);
                if(creep.store[RESOURCE_ENERGY] == 0){
                    creep.memory.task = "MINE";
                    Roles.HARVESTER.run(creep);
                }else{
                    let site = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                    if(site){
                        if(creep.build(site) == ERR_NOT_IN_RANGE){
                            creep.moveTo(spawns[0].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }else{
                        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                            creep.moveTo(creep.room.controller.pos, {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                }
            }else{
                console.log(1);
                creep.memory.task = "MINE";
            }
        },
            [[300, [MOVE, MOVE, WORK, CARRY, CARRY]]]
    )
}

const Tasks = {
    MOVE: function(creep, ops){
        let pos = RoomPosition[ops.x, ops.y, ops.roomName];
        if(creep.pos != ops.pos){
            creep.moveTo(pos, {visualizePathStyle: {stroke: '#ffaa00'}});
            return false;
        }else{
            return true;
        }
    },
    HARVEST: function(creep, ops){
        if(creep.getFreeCapacity[RESOURCE_ENERGY] != 0){
            creep.harvest(Game.getObjectById(ops.target));
            return false;
        }
        return true;
    },
    BUILD: function(creep, ops){

    }
}

var CreepBodies = [

]

let role = {
    roles: Roles,
    roleNames: Object.keys(Roles)
};

module.exports = role;

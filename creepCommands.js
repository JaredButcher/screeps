var MRoomUtil = require("roomUtil");

//Queable commands, arguments must be serializeable
//Returns true if finished, false if command is ongoing
const commands = {
    //Harvest until carry is filled
    harvestSource: function(creep, sourceId){
        creep.harvest(Game.getObjectById(sourceId));
        if(creep.store.getFreeCapacity() == 0){
            return true;
        }
        return false;
    },
    //Harvest forever
    dropHarvestSource: function(creep, sourceId){
        creep.harvest(Game.getObjectById(sourceId));
        return false;
    },
    //Build something
    build: function(creep, siteId){
        return !(creep.build(Game.getObjectById(siteId)) == OK);
    },
    //Upgrade controller
    upgrade: function(creep){
        return !(creep.upgradeController(creep.room.controller) == OK);
    },
    //Repair something, optional max hitpoints to repair to
    repair: function(creep, hits=undefined){
        let target = Game.getObjectById(siteId);
        let status = creep.repair(Game.getObjectById(target)) == OK;
        if(hits){
            return !status || hits <= target.hits;
        }else{
            return !status || target.maxHits == target.hits;
        }
    },
    //Withdraw resource from target
    withdraw: function(creep, sourceId, resourceType, amount=undefined){
        let status = withdraw(Game.getObjectById(sourceId), resourceType, amount);
        return status != ERR_INVALID_TARGET && status != ERR_NOT_IN_RANGE;
    },
    //Pull target Creep
    pullMoveTo: function(creep, targetId, x, y, roomName=undefined){
        let targetPos;
        let targetCreep = Game.getObjectById(targetId);
        if(roomName){
            targetPos = Game.rooms[roomName].getPositionAt(x, y);
        }else{
            targetPos = creep.room.getPositionAt(x, y);
        }
        if(creep.pos == targetPos || creep.moveTo(Game.rooms[roomName]) == ERR_NO_PATH) {
            targetCreep.memory.bePulledToWait = false;
            return true;
        }
        creep.pull(targetCreep);
        targetCreep.move(creep);
        return false;
    },
    //Pause until pull operation is compelte
    bePulledMoveTo: function(creep, targetId){
        if(creep.memory.bePulledToWait){
            return false;
        }else{
            return true;
        }
    },
    //Claim a room
    claim: function(creep, targetId){
        if(creep.claimController(Game.getObjectById(targetId)) != OK){
            console.log("FAILED TO CLAIM");
        }
        return true;
    },
    //Move to a position
    moveTo: function(creep, x, y, roomName=undefined){
        let targetPos;
        if(roomName){
            targetPos = Game.rooms[roomName].getPositionAt(x, y);
        }else{
            targetPos = creep.room.getPositionAt(x, y);
        }
        if(creep.pos == targetPos) return true;
        return creep.moveTo(Game.rooms[roomName]) == ERR_NO_PATH;
    },
    //Pickup droped resource
    pickup: function(creep, targetId){
        creep.pickup(Game.getObjectById(target));
        return true;
    },
    //Transfer resource
    transfer: function(creep, targetId, resourceType, amount=undefined){
        let status = creep.transfer(Game.getObjectById(targetId), resourceType, amount);
        return status != ERR_INVALID_TARGET && status != ERR_NOT_IN_RANGE;
    },
    //Remove this creep from the creeps working the given source
    popSourceAssignment: function(creep, roomName, soruceId){
        let newCreeps = Game.rooms[roomName].memory.soruces[sourceId].creeps.filter((value, index, arr) => value != creep.id);
        Game.rooms[roomName].memory.soruces[sourceId].creeps = newCreeps;
        return true;
    },
    //Remove this creep from the given assignment
    popRoomAssignment: function(creep, roomName, task){
        let newCreeps = Game.rooms[roomName].memory.taskAssigns[task].assigned.filter((value, index, arr) => value != creep.id);
        Game.rooms[roomName].memory.taskAssigns[task].assigned = newCreeps;
        return true;
    },
    //Dump in nearest containers in room until empty extension -> tower -> container / storage -> spawn
    dump: function(creep, resourceType){
        if(creep.store.getCapacity() > 0){
            let storage = []
            if(resourceType == RESOURCE_ENERGY){
                storage = creep.find(FIND_MY_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity() > 0});
                if(storage.length == 0) {
                    storage = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_EXTENSION && structure.store.getFreeCapacity() > 0});
                }
            }
            if(storage.length == 0) {
                storage = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => 
                    (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE)
                    && structure.store.getFreeCapacity() > 0});
            }
            if(resourceType == RESOURCE_ENERGY && storage.length == 0) storage = creep.room.find(FIND_MY_SPAWNS, {filter: (structure) => structure.store.getFreeCapacity() > 0});
            if(storage.length == 0) return true;
            MCreepUtil.unshiftCommand(creep, "dump", [resourceType]);
            MCreepUtil.unshiftCommand(creep, "transfer", [storage[0].id, resourceType]);
            MCreepUtil.unshiftCommand(creep, "moveTo", [storage[0].pos.x, storage[0].pos.y, storage[0].pos.roomName]);
        }
        return true;
    },
    //Fill up on energy by any means
    obtainEnergy: function (creep){
        if(creep.store.getFreeCapacity() == 0) return true;
        //Look for containers
        let storage = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => 
            (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE)
            && structure.store.getCapacity(RESOURCE_ENERGY) > 0});
        //If no containers with resource, mine some
        if(storage.length == 0){
            MCreepUtil.unshiftCommand(creep, "obtainEnergy", []);
            MCreepUtil.unshiftCommand(creep, "harvestSource", [storage[0].id]);
            MCreepUtil.unshiftCommand(creep, "moveTo", [storage[0].pos.x, storage[0].pos.y, storage[0].pos.roomName]);
        }else{
            MCreepUtil.unshiftCommand(creep, "obtainEnergy", []);
            MCreepUtil.unshiftCommand(creep, "withdraw", [storage[0].id, RESOURCE_ENERGY]);
            MCreepUtil.unshiftCommand(creep, "moveTo", [storage[0].pos.x, storage[0].pos.y, storage[0].pos.roomName]);
            return true;      
        }
        return true;
        //Repeat until resource obtained
    }
};

module.exports = commands;

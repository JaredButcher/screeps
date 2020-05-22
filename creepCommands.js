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
        if(hits){
            let target = Game.getObjectById(siteId);
            let status = creep.repair(Game.getObjectById(target)) == OK;
            return !status || hits <= target.hits;
        }else{
            return !(creep.repair(Game.getObjectById(siteId)) == OK);
        }
    },
    //Withdraw resource from target
    withdraw: function(creep, sourceId, resourceType, amount=undefined){
        withdraw(Game.getObjectById(sourceId), resourceType, amount);
        return true;
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
        creep.transfer(Game.getObjectById(targetId), resourceType, amount);
        return true;
    }
};

module.exports = commands;

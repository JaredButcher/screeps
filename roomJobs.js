var MCreepUtil = require("creepUtil");
var MRoomUtil = require("roomUtil");

const roomJobs = {
    harvest: function(room, sourceId){
        sourceInfo = room.memory.sources[sourceId]
        let storages = room.find(FIND_MY_STRUCTURES, {filter: (structure) => structure.store != undefined});
        if(storages.length == 0) return false;
        //Validate that source's creeps are still alive
        let validCreeps = [];
        for(let creep of sourceInfo.creeps){
            if(Game.getObjectById(creep)) validCreeps.push(creep);
        }
        room.memory.sources[sourceId].creeps = validCreeps;
        //Check if harvesting
        if(sourceInfo.dedicated == 0 || sourceInfo.dedicated > sourceInfo.creeps.length){
            //Determin harvester type
            if(sourceInfo.drop){
                let drop = Game.getObjectById(sourceInfo.drop);
                //Worker
                room.memory.sources[sourceId].dedicated = 1
                let creep = MRoomUtil.findFreeCreep(room, MCreepUtil.genericTypes.WORK);
                if(creep){
                    if(typeof(creep) == "Creep"){
                        MCreepUtil.clearQueue(creep);
                        MCreepUtil.queueCommand(creep, "moveTo", [drop.x, drop.y, drop.roomName]);
                        MCreepUtil.queueCommand(creep, "dropHarvestSource", [sourceId], true);
                        room.memory.sources[sourceId].creeps.push(creep.id);
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    let cost = MRoomUtil.maxCreepCost(room);
                    if(MCreepUtil.bodyType.WORK.maxCost != 0) cost = Math.max(MCreepUtil.bodyType.WORK.maxCost, cost);
                    roomUtil.queueJob(room, "spawnCreep", [cost, MCreepUtil.bodyType.WORK])
                    return false;
                }
            }else{
                //General - fill extensions -> spawn -> nearest storage, no repeat
                let creep = MRoomUtil.findFreeCreep(room, MCreepUtil.genericTypes.GENERAL);
                if(creep){
                    if(typeof(creep) == "Creep"){
                        let source = Game.getObjectById(sourceId);
                        MCreepUtil.clearQueue(creep);
                        MCreepUtil.queueCommand(creep, "moveTo", [source.pos.x, source.pos.y, source.pos.roomName]);
                        MCreepUtil.queueCommand(creep, "harvestSource", [sourceId]);
                        MCreepUtil.queueCommand(creep, "popSourceAssignment", [room.name, sourceId]);
                        MCreepUtil.queueCommand(creep, "dump");
                        room.memory.sources[sourceId].creeps.push(creep.id);
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    roomUtil.queueJob(room, "spawnCreep", [300, MCreepUtil.bodyType.GENERAL])
                    return false;
                }
            }
        }
        return true;
    },
    //Preform general maintance
    repair: function(room){
        //Have we maxed out repair bots
        if(MRoomUtil.updateTaskAssign(room, "REPAIR")){
            //Find something needing repairs
            let defenceTargetHits = Math.pow(2, (room.contoller.level + 7));
            let repairsNeeded = room.find(FIND_MY_STRUCTURES, {filter: (structure) => 
                (structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_RAMPART && structure.structureType != STRUCTURE_ROAD && structure.structureType != STRUCTURE_WALL) ||
                (structure.hits < structure.hitsMax / 2 && structure.structureType != STRUCTURE_ROAD) ||
                (structure.hits <  defenceTargetHits && (structure.structureType != STRUCTURE_WALL || structure.structureType != STRUCTURE_RAMPART))
            });
            //Find general repair creep within limits
            let creep = MRoomUtil.findFreeCreep(room, MCreepUtil.genericTypes.GENERAL);
            if(creep){
                if(typeof(creep) == "Creep"){
                    MCreepUtil.clearQueue(creep);
                    //If empty, reload
                    if(creep.store.getUsedCapacity(RESOURCE_ENERGY) < 10){
                        MCreepUtil.queueCommand(creep, "obtainEnergy", []);
                    }
                    MCreepUtil.queueCommand(creep, "moveTo", [repairsNeeded[0].pos.x, repairsNeeded[0].pos.y, repairsNeeded[0].pos.roomName]);
                    //Only repair walls / ramparts to a reasonable level
                    if(repairsNeeded[0].structureType == STRUCTURE_RAMPART || repairsNeeded[0].structureType == STRUCTURE_WALL){
                        MCreepUtil.queueCommand(creep, "repair", [repairsNeeded[0].id, defenceTargetHits]);
                    }else{
                        MCreepUtil.queueCommand(creep, "repair", [repairsNeeded[0].id]);
                    }
                    MCreepUtil.queueCommand(creep, "popRoomAssignment", [room.name, "REPAIR"]);
                    room.memory.taskAssigns["REPAIR"].assigned.push(creep.id);
                    return true;
                }else{
                    return false;
                }
            }else{
                let cost = Math.min(MRoomUtil.maxCreepCost(room), 500);
                roomUtil.queueJob(room, "spawnCreep", [cost, MCreepUtil.bodyType.GENERAL])
                return false;
            }
        }
        return true;
    },
    //Repair a specific broken thing
    repairObject: function(room, targetId){
        //Find general type
        //Fetch and repair / repair
    },
    upgrade: function(room){
        //Are existing creeps working on upgrades at limit
        if(MRoomUtil.updateTaskAssign(room, "UPGRADE") && room.contoller){
            let creep = MRoomUtil.findFreeCreep(room, MCreepUtil.genericTypes.GENERAL);
            if(creep){
                if(typeof(creep) == "Creep"){
                    MCreepUtil.clearQueue(creep);
                    //If empty, reload
                    if(creep.store.getUsedCapacity(RESOURCE_ENERGY) < 10){
                        MCreepUtil.queueCommand(creep, "obtainEnergy", []);
                    }
                    MCreepUtil.queueCommand(creep, "moveTo", [room.contoller.pos.x, room.contoller.pos.y, room.contoller.pos.roomName]);
                    //Only repair walls / ramparts to a reasonable level
                    MCreepUtil.queueCommand(creep, "upgrade", []);
                    MCreepUtil.queueCommand(creep, "popRoomAssignment", [room.name, "UPGRADE"]);
                    room.memory.taskAssigns["UPGRADE"].assigned.push(creep.id);
                    return true;
                }else{
                    return false;
                }
            }else{
                let cost = Math.min(MRoomUtil.maxCreepCost(room), 500);
                roomUtil.queueJob(room, "spawnCreep", [cost, MCreepUtil.bodyType.GENERAL])
                return false;
            }
        }
        return true;
    },
    build: function(room){
        //Have we maxed out build bots
        if(MRoomUtil.updateTaskAssign(room, "BUILD")){
            //Find construction site
            let constructionSite = room.find(FIND_MY_CONSTRUCTION_SITES);
            if(constructionSite.length == 0) return true;
            //Find general creep
            let creep = MRoomUtil.findFreeCreep(room, MCreepUtil.genericTypes.GENERAL);
            if(creep){
                if(typeof(creep) == "Creep"){
                    MCreepUtil.clearQueue(creep);
                    //If empty, reload
                    if(creep.store.getUsedCapacity(RESOURCE_ENERGY) < 10){
                        MCreepUtil.queueCommand(creep, "obtainEnergy", []);
                    }
                    MCreepUtil.queueCommand(creep, "moveTo", [constructionSite[0].pos.x, constructionSite[0].pos.y, constructionSite[0].pos.roomName]);
                    MCreepUtil.queueCommand(creep, "build", [constructionSite[0].id]);
                    MCreepUtil.queueCommand(creep, "popRoomAssignment", [room.name, "BUILD"]);
                    room.memory.taskAssigns["BUILD"].assigned.push(creep.id);
                    return true;
                }else{
                    return false;
                }
            }else{
                let cost = Math.min(MRoomUtil.maxCreepCost(room), 500);
                roomUtil.queueJob(room, "spawnCreep", [cost, MCreepUtil.bodyType.GENERAL])
                return false;
            }
        }
        return true;
    },
    buildObject: function(room, siteId){
        //Find general type - within limits
        //Fetch and build / build
        return true;
    },
    fetch: function(room){
        //Find fullest source container - within limits
        //Fetch and transport to extensions -> spawns -> storage
        return true;
    },
    fetchTo: function(room, sourceId, targetId){
        //Find transportor - within limits
        //Fetch and transport
        return true;
    },
    refillObject: function(room, targetId){
        //Find transportor - within limits
        //Fetch from storage and fill target
        return true;
    },
    refillSpawns: function(room){
        //If refill required
        //Find transportor - within limits
        //Fetch from storage and fill extensions -> spawns
        return true;
    },
    refillTowers: function(room){
        //If refill required
        //Find transportor - within limits
        //Fetch from storage and fill towers
        return true;
    },
    spawnCreep: function(room, cost, bodyType){
        let spawns = room.find(FIND_MY_SPAWNS);
        let body = bodyType.build(cost);
        for(let spawn of spawns){
            if(spawn.spawnCreep(body, name, {dryRun: true}) == OK){
                let sucess = spawn.spawnCreep(body, MCreepUtil.bodyType.WORK.generic + Memory.lifetimeCreepSpawnCount, {memory: {'bodyType': bodyType.name}}) == OK;
                if(sucess) Memory.lifetimeCreepSpawnCount += 1;
                return sucess;
            }
        }
        return false;
    },
    searchForHostiles: function(room){
        if(room.memory.defcon == 0){
            let hostiles = room.find(FIND_HOSTILE_CREEPS);
            if(hostiles.length > 0) room.memory.defcon = 1;
        }
        return true;
    }
};

module.exports = roomJobs;

var MCreepUtil = require("creepUtil");
var MCreepCommands = require("creepCommands");
var MRoomUtil = require("roomUtil");

const roomJobs = {
    jobs: {
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
                    let creep = MRoomUtil.findFreeCreep(room, MCreepUtil.bodyTypes.WORK.generic);
                    if(creep){
                        if(typeof(creep) == "object"){
                            MCreepCommands.manage.clearQueue(creep);
                            MCreepCommands.manage.queueCommand(creep, "moveTo", [drop.x, drop.y, drop.roomName, 1]);
                            MCreepCommands.manage.queueCommand(creep, "dropHarvestSource", [sourceId], true);
                            room.memory.sources[sourceId].creeps.push(creep.id);
                            return true;
                        }else{
                            return false;
                        }
                    }else{
                        let cost = MRoomUtil.maxCreepCost(room);
                        if(MCreepUtil.bodyTypes.WORK.maxCost != 0) cost = Math.max(MCreepUtil.bodyTypes.WORK.maxCost, cost);
                        roomJobs.manage.queueJob(room, "spawnCreep", [cost, MCreepUtil.bodyTypes.WORK.name])
                        return false;
                    }
                }else{
                    //General - fill extensions -> spawn -> nearest storage, no repeat
                    let creep = MRoomUtil.findFreeCreep(room, MCreepUtil.bodyTypes.GENERAL.generic);
                    if(creep){
                        if(typeof(creep) == "object"){
                            let source = Game.getObjectById(sourceId);
                            MCreepCommands.manage.clearQueue(creep);
                            MCreepCommands.manage.queueCommand(creep, "moveTo", [source.pos.x, source.pos.y, source.pos.roomName, 1]);
                            MCreepCommands.manage.queueCommand(creep, "harvestSource", [sourceId]);
                            MCreepCommands.manage.queueCommand(creep, "popSourceAssignment", [room.name, sourceId]);
                            MCreepCommands.manage.queueCommand(creep, "dump", [RESOURCE_ENERGY]);
                            room.memory.sources[sourceId].creeps.push(creep.id);
                            return true;
                        }else{
                            return false;
                        }
                    }else{
                        if(!room.memory.queuedSpawn) {
                            roomJobs.manage.queueJob(room, "spawnCreep", [300, MCreepUtil.bodyTypes.GENERAL.name]);
                            room.memory.queuedSpawn = true;
                        }
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
                let defenceTargetHits = Math.pow(2, (room.controller.level + 7));
                let repairsNeeded = room.find(FIND_MY_STRUCTURES, {filter: (structure) => 
                    (structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_RAMPART && structure.structureType != STRUCTURE_ROAD && structure.structureType != STRUCTURE_WALL) ||
                    (structure.hits < structure.hitsMax / 2 && structure.structureType != STRUCTURE_ROAD) ||
                    (structure.hits <  defenceTargetHits && (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART))
                });
                if(repairsNeeded.length == 0) return true;
                //Find general repair creep within limits
                let creep = MRoomUtil.findFreeCreep(room, MCreepUtil.bodyTypes.GENERAL.generic);
                if(creep){
                    if(typeof(creep) == "object"){
                        MCreepCommands.manage.clearQueue(creep);
                        //If empty, reload
                        if(creep.store.getUsedCapacity(RESOURCE_ENERGY) < 10){
                            MCreepCommands.manage.queueCommand(creep, "obtainEnergy", []);
                        }
                        MCreepCommands.manage.queueCommand(creep, "moveTo", [repairsNeeded[0].pos.x, repairsNeeded[0].pos.y, repairsNeeded[0].pos.roomName, 2]);
                        //Only repair walls / ramparts to a reasonable level
                        if(repairsNeeded[0].structureType == STRUCTURE_RAMPART || repairsNeeded[0].structureType == STRUCTURE_WALL){
                            MCreepCommands.manage.queueCommand(creep, "repair", [repairsNeeded[0].id, defenceTargetHits]);
                        }else{
                            MCreepCommands.manage.queueCommand(creep, "repair", [repairsNeeded[0].id]);
                        }
                        MCreepCommands.manage.queueCommand(creep, "popRoomAssignment", [room.name, "REPAIR"]);
                        room.memory.taskAssigns["REPAIR"].assigned.push(creep.id);
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    if(!room.memory.queuedSpawn) {
                        let cost = Math.min(MRoomUtil.maxCreepCost(room), 500);
                        roomJobs.manage.queueJob(room, "spawnCreep", [cost, MCreepUtil.bodyTypes.GENERAL.name]);
                        room.memory.queuedSpawn = true;
                    }
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
            if(MRoomUtil.updateTaskAssign(room, "UPGRADE") && room.controller.my){
                let creep = MRoomUtil.findFreeCreep(room, MCreepUtil.bodyTypes.GENERAL.generic);
                if(creep){
                    if(typeof(creep) == "object"){
                        MCreepCommands.manage.clearQueue(creep);
                        //If empty, reload
                        if(creep.store.getUsedCapacity(RESOURCE_ENERGY) < 10){
                            MCreepCommands.manage.queueCommand(creep, "obtainEnergy", []);
                        }
                        MCreepCommands.manage.queueCommand(creep, "moveTo", [room.controller.pos.x, room.controller.pos.y, room.controller.pos.roomName, 2]);
                        //Only repair walls / ramparts to a reasonable level
                        MCreepCommands.manage.queueCommand(creep, "upgrade", []);
                        MCreepCommands.manage.queueCommand(creep, "popRoomAssignment", [room.name, "UPGRADE"]);
                        room.memory.taskAssigns["UPGRADE"].assigned.push(creep.id);
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    if(!room.memory.queuedSpawn) {
                        let cost = Math.min(MRoomUtil.maxCreepCost(room), 500);
                        roomJobs.manage.queueJob(room, "spawnCreep", [cost, MCreepUtil.bodyTypes.GENERAL.name])
                        room.memory.queuedSpawn = true;
                    }
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
                let creep = MRoomUtil.findFreeCreep(room, MCreepUtil.bodyTypes.GENERAL.generic);
                if(creep){
                    if(typeof(creep) == "object"){
                        MCreepCommands.manage.clearQueue(creep);
                        //If empty, reload
                        if(creep.store.getUsedCapacity(RESOURCE_ENERGY) < 10){
                            MCreepCommands.manage.queueCommand(creep, "obtainEnergy", []);
                        }
                        MCreepCommands.manage.queueCommand(creep, "moveTo", [constructionSite[0].pos.x, constructionSite[0].pos.y, constructionSite[0].pos.roomName, 2]);
                        MCreepCommands.manage.queueCommand(creep, "build", [constructionSite[0].id]);
                        MCreepCommands.manage.queueCommand(creep, "popRoomAssignment", [room.name, "BUILD"]);
                        room.memory.taskAssigns["BUILD"].assigned.push(creep.id);
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    if(!room.memory.queuedSpawn) {
                        let cost = Math.min(MRoomUtil.maxCreepCost(room), 500);
                        roomJobs.manage.queueJob(room, "spawnCreep", [cost, MCreepUtil.bodyTypes.GENERAL.name])
                        room.memory.queuedSpawn = true;
                    }
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
            let body = MCreepUtil.bodyTypes[bodyType].build(cost);
            for(let spawn of spawns){
                if(spawn.spawnCreep(body, MCreepUtil.bodyTypes[bodyType].name + Memory.lifetimeCreepSpawnCount, {dryRun: true}) == OK){
                    let sucess = spawn.spawnCreep(body, MCreepUtil.bodyTypes.WORK.generic + Memory.lifetimeCreepSpawnCount, {memory: {'bodyType': bodyType}}) == OK;
                    if(sucess) {
                        Memory.lifetimeCreepSpawnCount += 1;
                        room.memory.queuedSpawn = false;
                    }
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
    },
    manage: {
        //Add a new job to the rooms's job queue / run job
        queueJob: function(room, job, jobArgs=[], priority=false, repeat=false){
            if(!room.memory.inited) this.initRoom(room);
            room.memory.jobQueue.push({'job': job, 'jobArgs': jobArgs, 'priority': priority, 'repeat': repeat});
            if(room.memory.currentJob == null) this.nextJob(room);
        },
        //Clear all of the room's jobs
        clearQueue: function(room){
            if(!room.memory.inited) this.initRoom(room);
            room.memory.jobQueue = [];
            room.memory.currentJob = null;
        },
        //Start the next job on the job queue, currentJob is null if there is nothing to do
        nextJob: function(room){
            if(!room.memory.inited) this.initRoom(room);
            if(room.memory.jobQueue.length > 0){
                for(let i in room.memory.jobQueue){
                    if(room.memory.jobQueue[i].priority == room.memory.nextQueuePriority){
                        room.memory.currentJob = room.memory.jobQueue[i];
                        room.memory.nextQueuePriority = !room.memory.nextQueuePriority;
                        room.memory.jobQueue.splice(i, 1);
                        return;
                    }
                }
                room.memory.currentJob = room.memory.jobQueue[0];
                room.memory.jobQueue.shift();
            }
        },
        //Process the room's job queue
        processJob: function(room){
            if(!room.memory.inited) this.initRoom(room);
            if(room.memory.currentJob){
                if(!roomJobs.jobs[room.memory.currentJob.job](room, ...room.memory.currentJob.jobArgs) || room.memory.currentJob.repeat){
                    room.memory.jobQueue.push(room.memory.currentJob);
                }
                room.memory.currentJob = null;
                this.nextJob(room);
            }
        },
        initRoom: function(room){
            if(!room.memory.inited){
                room.memory.inited = true;
                room.memory.lastLevel = 0;
                room.memory.defcon = 0;
                room.memory.turn = 0;
                room.memory.actionsPerTick = 1;
                room.memory.jobQueue = [];
                room.memory.currentJob = null;
                room.memory.nextQueuePriority = false;
                room.memory.queuedSpawn = false;
                room.memory.sources = {};
                room.memory.taskAssigns = {
                    REPAIR: {max: 1, assigned: []},
                    UPGRADE: {max: 1, assigned: []},
                    TRANSPORT: {max: 1, assigned: []},
                    BUILD: {max: 1, assigned: []}
                };
                for(let source of room.find(FIND_SOURCES)){
                    //Dump container id, link id, road exists, number of dedicated creeps, assigned creeps
                    room.memory.sources[source.id] = {dump:null, link:null, road:false, dedicated: 1, creeps:[]} 
                    this.queueJob(room, "harvest", [source.id], false, true);
                }
                this.queueJob(room, "upgrade", [], false, true);
                this.queueJob(room, "build", [], false, true);
                this.queueJob(room, "repair", [], false, true);
                this.queueJob(room, "searchForHostiles", [], false, true);
            }
        }
    }
};

module.exports = roomJobs;

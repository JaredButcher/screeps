var MRoomJobs = require("roomJobs");

const roomUtil = {
    initRoom: function(room){
        if(!room.memory.inited){
            room.memory.lastLevel = 0;
            room.memory.defcon = 0;
            room.memory.turn = 0;
            room.memory.actionsPerTick = 1;
            room.memory.jobQueue = [];
            room.memory.currentJob = null;
            room.memory.nextQueuePriority = false;
            room.memory.sources = {};
            for(let source of room.find(FIND_SOURCES)){
                //Dump container id, link id, road exists, number of dedicated creeps, assigned creeps
                room.memory.sources[source.id] = {dump:null, link:null, road:false, dedicated: 0, creeps:[]} 
                this.queueJob(room, "harvest", [source.id], false, true);
            }
            room.memory.taskAssigns = {
                REPAIR: {max: 1, assigned: []},
                UPGRADE: {max: 1, assigned: []},
                TRANSPORT: {max: 1, assigned: []},
                BUILD: {max: 1, assigned: []}
            };
            room.memory.inited = true;
            this.queueJob(room, "upgrade", [], false, true);
            this.queueJob(room, "build", [], false, true);
            this.queueJob(room, "repair", [], false, true);
            this.queueJob(room, "searchForHostiles", [], false, true);
        }
    },
    buildStructureNear: function(room, target, structure, minDistance=2, maxDistance=10){
        for(let r = minDistance; r <= maxDistance; ++r){
            for(let i = 0; i < r * 2 + 1; i += 2){
                if(room.createConstructionSite(target.x - r, target.y - r + i, structure) == OK) return true;
                if(room.createConstructionSite(target.x + r, target.y - r + i, structure) == OK) return true;
                if(room.createConstructionSite(target.x - r + i, target.y + r, structure) == OK) return true;
                if(room.createConstructionSite(target.x - r + i, target.y - r, structure) == OK) return true;
            }
        }
        return false;
    },
    buildRoad: function(room, startPos, endPos){
        let path = room.findPath(startPos, endPos, {ignoreCreeps: true, plainCost: 2, swampCost: 2, costCallback: function(roomName, costMat){
            let constructionSitesNotRoads = room.find(FIND_MY_CONSTRUCTION_SITES, {filter: (site) => site.sturctureType != STRUCTURE_ROAD});
            let constructionSitesRoads = room.find(FIND_MY_CONSTRUCTION_SITES, {filter: (site) => site.sturctureType != STRUCTURE_ROAD});
            let roads = room.find(FIND_STRUCTURES, {filter: (structure) => site.sturctureType != STRUCTURE_ROAD})
            for(let site of constructionSitesNotRoads){
                costMat.set(site.pos.x, site.pos.y, 255);
            }
            for(let site of constructionSitesRoads){
                costMat.set(site.pos.x, site.pos.y, 1);
            }
            for(let site of roads){
                costMat.set(site.pos.x, site.pos.y, 1);
            }
        }});
        for(let pos of roadPath){
            room.createConstructionSite(pos[0], pos[1], STRUCTURE_ROAD);
        }
    },
    //If free creep return it, if not and a such creep is spawning return true, else return false
    findFreeCreep: function(room, genericType){
        let creeps = room.find(FIND_MY_CREEPS, {filter: (creep) => MCreepUtil.bodyTypes[creep.memory.bodyType].generic == genericType && creep.memory.currentCommand == null});
        let spawns = room.find(FIND_MY_SPAWNS, {filter: (spawn) => spawn.spawning != null && spawn.spawning.name.includes(genericType)});
        if(creeps.length > 0){
            return creeps[0];
        }else if(spawns.length > 0){
            return true;
        }else{
            return false;
        }
    },
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
                    return;
                }
            }
            room.memory.currentJob = room.memory.jobQueue[0];
        }
    },
    //Process the room's job queue
    processJob: function(room){
        if(!room.memory.inited) this.initRoom(room);
        if(room.memory.currentJob){
            if(!MRoomJobs[room.memory.currentJob.job](room, ...room.memory.currentJob.jobArgs) || room.memory.currentJob.repeat){
                room.memory.jobQueue.push(room.memory.currentJob);
            }
            room.memory.currentJob = null;
            this.nextJob(room);
        }
    },
    //Counts spawns and extensions to find max possable creep size
    maxCreepCost: function(room){
        return 300 + 50 * room.find(FIND_MY_STRUCTURES, {filter: (structure) => structure.sturctureType == STRUCTURE_EXTENSION}).length;
    },
    //Check for creep death in assignments, return if we are below maximum
    updateTaskAssign(room, task){
        let validCreeps = [];
        for(let creepId of room.memory.taskAssigns[task].assigned){
            if(Game.getObjectById(creepId)) validCreeps.push(creepId);
        }
        room.memory.taskAssigns[task].assigned = validCreeps;
        return room.memory.taskAssigns[task].assigned < room.memory.taskAssigns[task].max;
    }
};

module.exports = roomUtil;

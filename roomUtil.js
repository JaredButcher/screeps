var MCreepUtil = require('creepUtil');

const roomUtil = {
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
            let buidings = room.find(FIND_STRUCTURES);
            let roads = room.find(FIND_STRUCTURES, {filter: (structure) => structure.sturctureType != STRUCTURE_ROAD})
            for(let site of constructionSitesNotRoads){
                costMat.set(site.pos.x, site.pos.y, 255);
            }
            for(let structure of buidings){
                costMat.set(structure.pos.x, structure.pos.y, 255);
            }
            for(let site of constructionSitesRoads){
                costMat.set(site.pos.x, site.pos.y, 1);
            }
            for(let site of roads){
                costMat.set(site.pos.x, site.pos.y, 1);
            }
        }});
        console.log(path.length)
        for(let pos of path){
            console.log(room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD));
        }
    },
    //If free creep return it, if not and a such creep is spawning return true, else return false
    findFreeCreep: function(room, genericType){
        let creeps = room.find(FIND_MY_CREEPS, {filter: (creep) => MCreepUtil.bodyTypes[creep.memory.bodyType] && MCreepUtil.bodyTypes[creep.memory.bodyType].generic == genericType && !creep.memory.currentCommand});
        let spawns = room.find(FIND_MY_SPAWNS, {filter: (spawn) => spawn.spawning != null && spawn.spawning.name.includes(genericType)});
        if(creeps.length > 0){
            return creeps[0];
        }else if(spawns.length > 0){
            return true;
        }else{
            return false;
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

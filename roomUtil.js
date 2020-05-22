const roomUtil = {
    initMemory: function(room){
        if(!room.memory.inited){
            room.memory.lastLevel = 0;
            room.memory.repeatingCommandQueue = [];
            room.memory.commandQueue = [];
            room.memory.priorityCommandQueue = [];
            room.memory.currentCommand = null;
            room.memory.timerState = 0;
            room.memory.sources = {};
            for(let source of room.find(FIND_SOURCES)){
                //Container, link, road, assigned creeps
                room.memory.sources[source.id] = [null, null, null, []] 
            }
            room.memory.inited = true;
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
        for(let pos in roadPath){
            room.createConstructionSite(pos[0], pos[1], STRUCTURE_ROAD);
        }
    },
    //If free creep return it, if not and a such creep is spawning return true, else return false
    findFreeCreep: function(room, genericType){
        let creeps = room.find(FIND_MY_CREEPS, {filter: (creep) => creep.memory.genericType == genericType && creep.memory.currentCommand == null});
        let spawns = room.find(FIND_MY_SPAWNS, {filter: (spawn) => spawn.spawning != null && spawn.spawning.name.includes(genericType)});
        if(creeps.length > 0){
            return creeps[0];
        }else if(spawns.length > 0){
            return true;
        }else{
            return false;
        }
    }
};

module.exports = roomUtil;

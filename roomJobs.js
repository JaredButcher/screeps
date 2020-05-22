var MCreepUtil = require("creepUtil");

const roomJobs = {
    harvest: function(room, sourceId){
        //Check if harvesting
        //Determin harvester type
        //Find harvester of type
        //Assign harvester - repeat
        return true;
    },
    //Preform general maintance
    repair: function(room){
        //Find something needing repairs
        //Find general type - within repair limits
        //Fetch and repair / repair
        return true;
    },
    //Repair a specific broken thing
    repairObject: function(room, targetId){
        //Find general type
        //Fetch and repair / repair
    },
    upgrade: function(room){
        //Find general type - within upgrade limits
        //Fetch and upgrade / upgrade
        return true;
    },
    build: function(room){
        //Find something needing built
        //Find general type - within general build limits
        //Fetch and build / build
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
    spawnCreep: function(room, name, cost, bodyType, genericType){
        let body = MCreepUtil.buildCreep(cost, bodyType);
        let spawns = room.find(FIND_MY_SPAWNS);
        for(let spawn of spawns){
            if(spawn.spawnCreep(body, name, {dryRun: true}) == OK){
                return spawn.spawnCreep(body, name, {memory: {'bodyType': bodyType, 'genericType': genericType}}) == OK;
            }
        }
        return false;
    }
};

module.exports = roomJobs;

import {isFlagOfType, flagTypes} from '../flags';

export enum CreepRoles{
    HARVEST = "HARVEST", 
    REPAIR = "REPAIR", 
    UPGRADE = "UPGRADE", 
    TRANSPORT = "TRANSPORT", 
    BUILD = "BUILD"
}

export function getConstructionSiteFlags(room: Room){
    return room.find(FIND_FLAGS, {filter: x => isFlagOfType(x, 'constructionSite')});
}
export function activateConstructionSite(room: Room, flag: Flag){
    room.createConstructionSite(flag.pos, (<ConstructionSiteFlagMemory>flag.memory).siteType);
    flag.remove();
}

export function buildRoad(room: Room, startPos: RoomPosition, endPos: RoomPosition){
    let path = room.findPath(startPos, endPos, {ignoreCreeps: true, plainCost: 2, swampCost: 2, costCallback: function(roomName: string, costMat: CostMatrix){
        //Find all regular buildings execpt ramparts and roads
        let buidings = room.find(FIND_STRUCTURES, {filter: (structure) => 
            structure.structureType != STRUCTURE_ROAD && structure.structureType != STRUCTURE_RAMPART}).map(x => x.pos);
        //Add construction sites
        buidings.concat(room.find(FIND_MY_CONSTRUCTION_SITES, {filter: (site) => 
            site.structureType != STRUCTURE_ROAD && site.structureType != STRUCTURE_RAMPART}).map(x => x.pos));
        //Add flags for construction sites to be
        buidings.concat(getConstructionSiteFlags(room).filter(x => 
            (<ConstructionSiteFlagMemory>x.memory).siteType != STRUCTURE_ROAD && (<ConstructionSiteFlagMemory>x.memory).siteType != STRUCTURE_RAMPART).map(x => x.pos))
        
        //Find all roads
        let roads = room.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_ROAD}).map(x => x.pos);
        //Add construction sites
        roads.concat(room.find(FIND_MY_CONSTRUCTION_SITES, {filter: (site) => site.structureType == STRUCTURE_ROAD}).map(x => x.pos));
        //Add flags for construction sites to be
        roads.concat(getConstructionSiteFlags(room).filter(x => (<ConstructionSiteFlagMemory>x.memory).siteType == STRUCTURE_ROAD).map(x => x.pos));

        //Set the cost of building roads on those locations accordingly
        for(let structure of buidings){
            costMat.set(structure.x, structure.y, 255);
        }
        for(let road of roads){
            costMat.set(road.x, road.y, 1);
        }
        return costMat;
    }});
    for(let pos of path){
        if(!(room.getTerrain().get(pos.x, pos.y) & TERRAIN_MASK_WALL)){
            let flagName = room.createFlag(pos.x, pos.y, undefined, flagTypes['constructionSite'][0], flagTypes['constructionSite'][1]);
            (<ConstructionSiteFlagMemory>Game.flags[flagName].memory).siteType = STRUCTURE_ROAD;
        }
    }
}
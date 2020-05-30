import {registrare} from '../runner/runner';
import {RoomRunner} from './roomRunner';
import {RoomJobArgs, RoomJob} from './roomJob';
import {fetchPromise} from '../utils';
import {buildRoad} from './roomUtils';
import {isFlagOfType, flagTypes} from 'flags';

export class RoomJobPlan extends RoomJob{
    constructor(runner: RoomRunner, args: RoomJobArgs, repeating: boolean = false, promiseId?: string){
        super(runner, args, repeating, promiseId);
    }
    run(){
        let room = <Room>this.runner.actor;
        let crashing: boolean = true;
        if(room.controller){
            //Set current plans
            this.planByController(room);
            //Check that sources are covered to prevent crashing
            for(let source of room.find(FIND_SOURCES)){
                let sourceEntry = room.memory.sources[source.id];
                //Remove expired harvester entries 
                let validEntries: CreepPromiseMemory[] = [];
                for(let harvester of sourceEntry.harvesters){
                    if(fetchPromise(harvester.promise) == PromiseState.RUNNING){
                        validEntries.push(harvester);
                    }
                }
                sourceEntry.harvesters = validEntries;
                if(sourceEntry.harvesters.length != 0){
                    crashing = false;
                }
                //Make sure not crashing
                if(sourceEntry.harvesters.length != 0){
                    crashing = false;
                }
                //Remove expired other entries 
                validEntries = [];
                for(let creep of sourceEntry.otherUsers){
                    if(fetchPromise(creep.promise) == PromiseState.RUNNING){
                        validEntries.push(creep);
                    }
                }
                sourceEntry.otherUsers = validEntries;
            }
            room.memory.crashRecovery = crashing;
            //Check other roles for expired creeps
            for(let key in room.memory.creepRoles){
                let roleInfo = room.memory.creepRoles[key];
                let validCreeps: CreepPromiseMemory[] = [];
                for(let creep of roleInfo.current){
                    let promise = fetchPromise(creep.promise);
                    if(promise == PromiseState.RUNNING) validCreeps.push(creep);
                }
                roleInfo.current = validCreeps;
            }
        }
        //Build structures
        return false;
    }
    planByController(room: Room){
        let levelChange = room.memory.lastLevel != (<StructureController>room.controller).level;
        if(levelChange){
            room.memory.lastLevel = (<StructureController>room.controller).level;
            if(room.memory.lastLevel >= 2 && room.memory.corePlaced){
                for(let sourceId in room.memory.sources){
                    let source = <Source>Game.getObjectById(sourceId);
                    if(!room.memory.sources[sourceId].hasRoad){
                        buildRoad(room, <RoomPosition>room.getPositionAt(room.memory.corePos.x, room.memory.corePos.y), source.pos);
                        room.memory.sources[sourceId].hasRoad = true;
                    }
                    //If doesn't have a link or container, build container
                    if(!room.memory.sources[sourceId].hasContainer && !room.memory.sources[sourceId].hasLink){
                        //Find local features
                        let area = room.lookAtArea(source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true);
                        //Find spaces where it cannot be built
                        let invalidLocs = area.filter( x => (x.type != "creep" && x.type != "powerCreep" && x.type != "tombstone" &&
                            (x.type != "terrain" || (<Terrain>x.terrain) != "wall") && 
                            (x.type != "constructionSite" || (<ConstructionSite>x.constructionSite).structureType != STRUCTURE_ROAD) && 
                            (x.type != "flag" || (isFlagOfType(<Flag>x.flag, "constructionSite") && 
                            (<ConstructionSiteFlagMemory>(<Flag>x.flag).memory).siteType != STRUCTURE_ROAD)))).map(x => [x.x, x.y]);
                        //Find places that are not invalid
                        let validLocs = area.map(x => [x.x, x.y]).filter( x => invalidLocs.indexOf(x) != -1);
                        if(validLocs.length > 0){
                            //Remove existing features (roads)
                            let atLoc = room.lookAt(validLocs[0][0], validLocs[0][1]);
                            for(let feature of atLoc){
                                if(feature.type == "flag"){
                                    (<Flag>feature.flag).remove();
                                }else if(feature.type == "structure"){
                                    (<Structure>feature.structure).destroy();
                                }else if(feature.type == "constructionSite"){
                                    (<ConstructionSite>feature.constructionSite).remove();
                                }
                            }
                            //Build
                            let flagName = room.createFlag(validLocs[0][0], validLocs[0][1], undefined, 
                                flagTypes['constructionSite'][0], flagTypes['constructionSite'][1]);
                                (<ConstructionSiteFlagMemory>Game.flags[flagName].memory).siteType = STRUCTURE_CONTAINER;
                            room.memory.sources[sourceId].hasContainer = true;
                        }
                    }
                }
            }
        }
        switch((<StructureController>room.controller).level){
            

            case 0:
                //Either mine for other room / scout / establish controller and spawn
            break;
            case 1:
                //Establish spawn, general harvesting, upgrading
                if(levelChange){
                    room.memory.creepRoles[CreepRoles.UPGRADE].max = room.find(FIND_SOURCES).length;
                    room.memory.creepRoles[CreepRoles.BUILD].max = 1;
                    room.memory.creepRoles[CreepRoles.REPAIR].max = 1;
                }
            break;
            case 2:
                //Start building (extensions, roads, drop containers), upgrading, drop harvesting
                if(levelChange){
                    room.memory.creepRoles[CreepRoles.UPGRADE].max = 1;
                    room.memory.creepRoles[CreepRoles.BUILD].max = 2;
                    room.memory.creepRoles[CreepRoles.REPAIR].max = 1;
                }
            break;
            case 3:
                //building (extensions, roads, walls, ramparts), upgrading
                if(levelChange){
                    room.memory.creepRoles[CreepRoles.UPGRADE].max = 2;
                    room.memory.creepRoles[CreepRoles.BUILD].max = 1;
                    room.memory.creepRoles[CreepRoles.REPAIR].max = 2;
                }
            break;
            case 4:
                //building (extensions, storage, tower), upgrading, repair walls / ramparts
                if(levelChange){
                    room.memory.creepRoles[CreepRoles.UPGRADE].max = 2;
                    room.memory.creepRoles[CreepRoles.BUILD].max = 1;
                    room.memory.creepRoles[CreepRoles.REPAIR].max = 2;
                }
            break;
            case 5:
                //building (extensions, tower, links), extra upgrading, repair walls / ramparts, mixed remote harvest
                if(levelChange){
                    room.memory.creepRoles[CreepRoles.UPGRADE].max = 2;
                    room.memory.creepRoles[CreepRoles.BUILD].max = 1;
                    room.memory.creepRoles[CreepRoles.REPAIR].max = 2;
                }
            break;
            case 6:
                //building (extensions, labs, terminal, link, extracter), extra upgrading, repair walls / ramparts, link harvesting, mineral harvest
                if(levelChange){
                    room.memory.creepRoles[CreepRoles.UPGRADE].max = 2;
                    room.memory.creepRoles[CreepRoles.BUILD].max = 1;
                    room.memory.creepRoles[CreepRoles.REPAIR].max = 2;
                }
            break;
            case 7:
                //building (extensions, labs, link, tower, spawn), extra upgrading, repair walls / ramparts
                if(levelChange){
                    room.memory.creepRoles[CreepRoles.UPGRADE].max = 2;
                    room.memory.creepRoles[CreepRoles.BUILD].max = 1;
                    room.memory.creepRoles[CreepRoles.REPAIR].max = 2;
                }
            break;
            case 8:
                //building (everything else), repair walls / ramparts, highly support other rooms
                if(levelChange){
                    room.memory.creepRoles[CreepRoles.UPGRADE].max = 1;
                    room.memory.creepRoles[CreepRoles.BUILD].max = 1;
                    room.memory.creepRoles[CreepRoles.REPAIR].max = 2;
                }
            break;
        }
    }
}

registrare["RoomJobPlan"] = RoomJobPlan;
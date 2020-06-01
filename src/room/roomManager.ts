import {Task, Manager} from '../runner/manager';
import {CreepBody} from '../creep/creepBody';
import {CreepTypes} from '../creep/creepUtils';
import {isFlagOfType, flagTypes} from '../flags';

export interface RoomTaskArgs{}

export class RoomTask extends Task{
    constructor(manager: RoomManager, args: RoomTaskArgs, repeating: boolean = false, promiseId?: string, name: string = RoomTask.name){
        super(manager, args, repeating, promiseId, name);
    }
}

interface CreepSpawnable{
    body: BodyPartConstant[];
    cost: number;
    bodyType: string;
}

export class RoomManager extends Manager{
    constructor(actor: Room, memory: ManagerMemory){
        super(actor, memory);
    }
    //Returns creep id if found, true if spawning, else false
    //Only one priority can be used
    findCreep(bodyType: CreepTypes, prioritizeFull = false, prioritizeEmpty = false, override = false, prioritizeDistance?: RoomPosition): boolean | Id<Creep>{
        let room = <Room>this.actor;
        //Find valid free creeps
        let creeps = room.find(FIND_MY_CREEPS, {filter: (x) => !x.spawning && x.memory.bodyType == bodyType && (override || x.memory.aQueue.length == 0)});
        //Does a valid free creep exist
        if(creeps.length > 0){
            if(prioritizeFull){
                creeps.sort((a, b) => a.store.getFreeCapacity(RESOURCE_ENERGY) - b.store.getFreeCapacity(RESOURCE_ENERGY));
            }else if(prioritizeEmpty){
                creeps.sort((a, b) => a.store.getUsedCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY));
            }else if(prioritizeDistance){
                return (<Creep>prioritizeDistance.findClosestByRange(creeps)).id;
            }
            //V8 js array#sort is now stable
            if(override){
                creeps.sort((a, b) => a.memory.aQueue.length - b.memory.aQueue.length);
            }
            return creeps[0].id;
        }else{
            //Is one being spawned
            for(let spawnId in room.memory.spawning){
                if(room.memory.spawning[spawnId].bodyType == bodyType){
                    return true;
                }
            }
            for(let creep of room.memory.spawnQueue){
                if(creep.bodyType == bodyType){
                    return true;
                }
            }
            return false;
        }
    }
    queueSpawn(body: CreepBody, priority = false){
        let room = <Room>this.actor;
        //Dont queue another of the same type that is currently spawning
        for(let spawnId in room.memory.spawning){
            if(room.memory.spawning[spawnId].bodyType == body.bodyType){
                return;
            }
        }
        if(priority){
            //If the same type as being pushed in is alreay here with priority, don't add
            if(room.memory.spawnQueue.length > 0 && room.memory.spawnQueue[0].bodyType == body.bodyType && room.memory.spawnQueue[0].priority){
                return;
            }
        }else{
            //Don't queue another of the same type already in the queue
            for(let creep of room.memory.spawnQueue){
                if(creep.bodyType == body.bodyType){
                    return;
                }
            }
        }
        let entry = {
            body: body.body,
            bodyType: body.bodyType,
            cost: body.cost,
            priority: priority
        };
        if(priority){
            room.memory.spawnQueue.unshift(entry);
        }else{
            room.memory.spawnQueue.push(entry);
        } 
    }
    maxCreepCost(): number{
        return (<Room>this.actor)
            .find(FIND_MY_STRUCTURES, {filter: (x) => x.structureType == STRUCTURE_SPAWN || x.structureType == STRUCTURE_EXTENSION})
            .map((x) => (<StoreDefinition>(<AnyStoreStructure>x).store).getCapacity(RESOURCE_ENERGY))
            .reduce((a, b) => a + b);
    }
    currentMaxCreepCost(): number{
        return (<Room>this.actor)
            .find(FIND_MY_STRUCTURES, {filter: (x) => x.structureType == STRUCTURE_SPAWN || x.structureType == STRUCTURE_EXTENSION})
            .map((x) => (<StoreDefinition>(<AnyStoreStructure>x).store).getUsedCapacity(RESOURCE_ENERGY))
            .reduce((a, b) => a + b);
    }
    getConstructionSiteFlags(): Flag[]{
        let room = <Room>this.actor;
        return <Flag[]>room.find(FIND_FLAGS, {filter: x => isFlagOfType(x, 'constructionSite')});
    }
    activateConstructionSite(flag: Flag){
        let room = <Room>this.actor;
        room.createConstructionSite(flag.pos, (<ConstructionSiteFlagMemory>flag.memory).siteType);
        flag.remove();
    }
    buildRoad(startPos: RoomPosition, endPos: RoomPosition){
        let room = <Room>this.actor;
        let path = room.findPath(startPos, endPos, {ignoreCreeps: true, plainCost: 2, swampCost: 2, costCallback: function(roomName: string, costMat: CostMatrix){
            //Find all regular buildings execpt ramparts and roads
            let buidings = room.find(FIND_STRUCTURES, {filter: (structure) => 
                structure.structureType != STRUCTURE_ROAD && structure.structureType != STRUCTURE_RAMPART}).map(x => x.pos);
            //Add construction sites
            buidings.concat(room.find(FIND_MY_CONSTRUCTION_SITES, {filter: (site) => 
                site.structureType != STRUCTURE_ROAD && site.structureType != STRUCTURE_RAMPART}).map(x => x.pos));
            //Add flags for construction sites to be
            buidings.concat((<Flag[]>this.getConstructionSiteFlags()).filter(x => 
                (<ConstructionSiteFlagMemory>x.memory).siteType != STRUCTURE_ROAD && (<ConstructionSiteFlagMemory>x.memory).siteType != STRUCTURE_RAMPART).map(x => x.pos))
            
            //Find all roads
            let roads = room.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == STRUCTURE_ROAD}).map(x => x.pos);
            //Add construction sites
            roads.concat(room.find(FIND_MY_CONSTRUCTION_SITES, {filter: (site) => site.structureType == STRUCTURE_ROAD}).map(x => x.pos));
            //Add flags for construction sites to be
            roads.concat((<Flag[]>this.getConstructionSiteFlags()).filter(x => (<ConstructionSiteFlagMemory>x.memory).siteType == STRUCTURE_ROAD).map(x => x.pos));
    
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
    queue(action: RoomTask){
        super.queue(action);
    }
    queuePriority(action: RoomTask){
        super.queuePriority(action);
    }
}

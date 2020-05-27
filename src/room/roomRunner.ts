import {JobRunner} from '../runner/jobRunner';
import {CreepBody} from '../creep/creepBody';

interface CreepSpawnable{
    body: BodyPartConstant[];
    cost: number;
    bodyType: string;
}

export class RoomRunner extends JobRunner{
    constructor(room: Room){
        super(room, room.memory);
    }
    //Returns creep id if found, true if spawning, else false
    //Only one priority can be used
    findCreep(bodyType: string, prioritizeFull = false, prioritizeEmpty = false, override = false, prioritizeDistance?: RoomPosition): boolean | Id<Creep>{
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
            if(room.memory.spawning[spawnId].bodyType == body.name){
                return;
            }
        }
        if(priority){
            //If the same type as being pushed in is alreay here with priority, don't add
            if(room.memory.spawnQueue.length > 0 && room.memory.spawnQueue[0].bodyType == body.name && room.memory.spawnQueue[0].priority){
                return;
            }
        }else{
            //Don't queue another of the same type already in the queue
            for(let creep of room.memory.spawnQueue){
                if(creep.bodyType == body.name){
                    return;
                }
            }
        }
        let entry = {
            body: body.body,
            bodyType: body.name,
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
}
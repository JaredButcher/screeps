import {Task, Manager} from '../runner/manager';
import {CreepBody} from '../creep/creepBody';
import {CreepTypes} from '../creep/creepUtils';

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
    queue(action: RoomTask){
        super.queue(action);
    }
    queuePriority(action: RoomTask){
        super.queuePriority(action);
    }
}

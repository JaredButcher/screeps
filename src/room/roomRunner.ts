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
    findCreep(bodyType: string, prioritizeFull = false, prioritizeEmpty = false, prioritizeDistance?: RoomPosition): boolean | Id<Creep>{
        let room = <Room>this.actor;
        //Find valid free creeps
        let creeps = room.find(FIND_MY_CREEPS, {filter: (x) => x.memory.bodyType == bodyType && x.memory.aQueue.length == 0});
        //Does a valid free creep exist
        if(creeps.length > 0){
            if(prioritizeFull){
                creeps.sort((a, b) => a.store.getFreeCapacity(RESOURCE_ENERGY) - b.store.getFreeCapacity(RESOURCE_ENERGY));
            }else if(prioritizeEmpty){
                creeps.sort((a, b) => a.store.getUsedCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY));
            }else if(prioritizeDistance){
                return (<Creep>prioritizeDistance.findClosestByRange(creeps)).id;
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
}
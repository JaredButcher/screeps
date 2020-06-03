import {initDistrictMemory} from './district/districtUtils';
import {initRoomMemory} from './room/roomInitMemory';
import {PROMISE_LIFE} from './utils';
import {CreepTypes} from './creep/creepUtils';
import {CreepRoles} from './room/roomUtils';
import {PromiseState} from './utils';

export function initMemory(){
    console.log("Initalizeing memory")
    Memory.inited = true;
    Memory.pause = false;
    Memory.promises = {};
    Memory.promiseCount = Math.floor(Math.random() * 100000);
    Memory.districts = {};
    Memory.president = {taskQueue: [], taskPromises: []};
    for(let district in Memory.districts){
        initDistrictMemory(Memory.districts[district]);
    }
    for(let roomName in Game.rooms){
        initRoomMemory(Game.rooms[roomName]);
    }
    for(let creepName in Game.creeps){
        let creep = <Creep>Game.creeps[creepName];
        creep.memory.inited = true;
        creep.memory.taskPromises = [];
        creep.memory.taskQueue = [];
        if(WORK in creep.body){
            creep.memory.bodyType = CreepTypes.GENERAL;
        }else if(CLAIM in creep.body){
            creep.memory.bodyType = CreepTypes.CLAIM;
        }else if(CARRY in creep.body){
            creep.memory.bodyType = CreepTypes.TRANSPORT;
        }else if(ATTACK in creep.body){

        }else if(RANGED_ATTACK in creep.body){

        }else if(HEAL in creep.body){
            
        }
    }
}

export function cleanMemory(){
    //Find dead creeps and end their tasks
    let creepsToRemove: string[] = [];
    for(let creepId in Memory.creeps){
        if(!Game.getObjectById(creepId)){
            for(let task of Memory.creeps[creepId].taskQueue){
                if(Memory.promises[task.promiseId].status == PromiseState.RUNNING){
                    Memory.promises[task.promiseId].status = PromiseState.ERR_DEAD;
                    Memory.promises[task.promiseId].age = Game.time;
                }
            }
            creepsToRemove.push(creepId);
        }
    }
    //Delete dead creep's memory
    for(let creepId of creepsToRemove){
        delete Memory.creeps[creepId];
    }
    //Find old tasks
    let promisesToRemvoe: string[] = [];
    for(let promiseId in Memory.promises){
        if(Memory.promises[promiseId].age != 0 && Game.time - Memory.promises[promiseId].age > PROMISE_LIFE){
            promisesToRemvoe.push(promiseId);
        }
    }
    //Delete old tasks
    for(let promisesId of promisesToRemvoe){
        delete Memory.promises[promisesId];
    }
}
const PROMISE_LIFE = 100;

export enum PromiseState {RUNNING, SUCESS, ERR_DEAD, ERR_INVALID_ARGS, 
    ERR_INVALID_TARGET, ERR_LACK_RESOURCE, ERR_PREEMPTED, ERR_MISC_ERROR};

export function cleanMemory(){
    //Find dead creeps and end their tasks
    let creepsToRemove: string[] = [];
    for(let creepId in Memory.creeps){
        if(!Game.getObjectById(creepId)){
            for(let promiseId of Memory.creeps[creepId].aPromises){
                if(Memory.promises[promiseId].status == PromiseState.RUNNING){
                    Memory.promises[promiseId].status = PromiseState.ERR_DEAD;
                    Memory.promises[promiseId].age = Game.time;
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
        if(Memory.promises[promiseId].age > PROMISE_LIFE){
            promisesToRemvoe.push(promiseId);
        }
    }
    //Delete old tasks
    for(let promisesId of promisesToRemvoe){
        delete Memory.promises[promisesId];
    }
}

export function initMemory(){
    Memory.inited = true;
    Memory.promises = {};
    Memory.promiseCount = Math.floor(Math.random() * 100000);
    Memory.districts = {};
    Memory.president = {aQueue: [], aPromises: [], aPriority: []};
}

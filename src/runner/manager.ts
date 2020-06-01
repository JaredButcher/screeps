import {fetchPromise, PromiseState} from '../utils';

export class Task{
    promiseId: string;
    repeating: boolean;
    args: object;
    name: string;
    manager: Manager;
    constructor(manager: Manager, args: object, name: string, repeating: boolean = false, promiseId?: string){
        this.repeating = repeating;
        this.args = args;
        this.manager = manager;
        this.name = name;
        if(promiseId === undefined){
            this.promiseId = Memory.promiseCount.toString();
            Memory.promiseCount = (Memory.promiseCount + 1) % 1000000000;
        }else{
            this.promiseId = promiseId;
        }
    }
    run(): [boolean, boolean]{
        this.end(PromiseState.SUCESS);
        return [true, false];
    }
    start(){
        Memory.promises[this.promiseId] = {status: PromiseState.RUNNING, age: 0};
    }
    end(status: PromiseState, force = false){
        if(force || !this.repeating){
            Memory.promises[this.promiseId] = {status: status, age: Game.time};
        }
    }
    toJSON(){
        return JSON.stringify({promiseId: this.promiseId, repeating: this.repeating, args: this.args, name: this.name});
    }
}

export class Manager{
    memory: ManagerMemory;
    actor: object;
    constructor(actor: object, memory: ManagerMemory){
        this.actor = actor;
        this.memory = memory;
    }
    queue(action: Task){
        action.start();
        this.memory.aQueue.push(action);
    }
    push(action: Task){
        action.start();
        this.memory.aQueue.unshift(action);
    }
    addPriority(action: Task){
        action.start();
        this.memory.aPriority.push(action);
    }
    removePriority(index: number, status: PromiseState){
        Memory.promises[this.memory.aPriority[index].promiseId] = {status: status, age: Game.time};
        this.memory.aPriority.splice(index, 1);
    }
    moveToPriority(index: number){
        this.memory.aPriority.push(this.memory.aQueue[index]);
        this.memory.aQueue.splice(index, 1);
    }
    moveFromPriority(index: number){
        this.memory.aQueue.push(this.memory.aPriority[index]);
        this.memory.aPriority.splice(index, 1);
    }
    clearQueue(){
        for(let action of this.memory.aQueue){
            Memory.promises[action.promiseId] = {status: PromiseState.ERR_PREEMPTED, age: Game.time};
        }
        this.memory.aQueue = [];
        for(let action of this.memory.aPriority){
            Memory.promises[action.promiseId] = {status: PromiseState.ERR_PREEMPTED, age: Game.time};
        }
        this.memory.aPriority = [];
    }
    shift(){
        this.memory.aQueue.shift();
    }
}

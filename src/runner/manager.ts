import {fetchPromise, PromiseState} from '../utils';

export class Task{
    promiseId: string;
    repeating: boolean;
    args: object;
    name: string;
    manager: Manager;
    constructor(manager: Manager, args: object, repeating: boolean = false, promiseId?: string, name: string = Task.name){
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
    run(): boolean{
        this.end(PromiseState.SUCESS);
        return true;
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
    queuePriority(action: Task){
        action.start();
        this.memory.aPriority.push(action);
    }
    pushPriority(action: Task){
        action.start();
        this.memory.aPriority.unshift(action);
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

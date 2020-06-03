import {fetchPromise, PromiseState} from '../utils';

export class Task{
    promiseId: string;
    repeating: boolean;
    args: object;
    name: string;
    manager: Manager;
    priority: boolean;
    constructor(manager: Manager, args: object, name: string, repeating: boolean = false, priority: boolean = false, promiseId?: string){
        this.repeating = repeating;
        this.args = args;
        this.manager = manager;
        this.name = name;
        this.priority = priority;
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
        return {promiseId: this.promiseId, repeating: this.repeating, args: this.args, name: this.name, priority: this.priority};
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
        this.memory.taskQueue.push(action);
    }
    push(action: Task){
        action.start();
        this.memory.taskQueue.unshift(action);
    }
    clearQueue(){
        for(let action of this.memory.taskQueue){
            Memory.promises[action.promiseId] = {status: PromiseState.ERR_PREEMPTED, age: Game.time};
        }
        this.memory.taskQueue = [];
    }
    shift(){
        this.memory.taskQueue.shift();
    }
}

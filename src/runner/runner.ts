export interface QueueableConstructor{
    new (...args: any[]): Queueable;
}

export let registrare: {[name: string]: QueueableConstructor} = {};

export class Queueable{
    promiseId: string;
    repeating: boolean;
    args: object;
    name: string = "Queueable";
    runner: Runner;
    constructor(runner: Runner, args: object, repeating: boolean = false, promiseId?: string){
        this.repeating = repeating;
        this.args = args;
        this.runner = runner;
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
}

registrare["Queueable"] = Queueable;

export class Runner{
    memory: RunnerMemory;
    actor: object;
    constructor(actor: object, memory: RunnerMemory){
        this.actor = actor;
        this.memory = memory;
    }
    run(){}
    queue(action: Queueable){
        action.start();
        this.memory.aQueue.push(action);
        this.memory.aPromises.push(action.promiseId);
    }
    push(action: Queueable){
        action.start();
        this.memory.aQueue.unshift(action);
        this.memory.aPromises.push(action.promiseId);
    }
    clearQueue(){
        for(let action of this.memory.aQueue){
            this.parseAction(action).end(PromiseState.ERR_PREEMPTED, true);
        }
        this.memory.aQueue = [];
    }
    parseAction(action: Queueable): Queueable{
        return new registrare[action.name](this, action.args, action.repeating, action.promiseId);
    }
    protected next(){
        this.memory.aQueue.shift();
    }
}


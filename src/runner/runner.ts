import {Queueable, registrare} from '../queueable/queueable';
import {PromiseState} from "../utils";
export {PromiseState};



export class Runner{
    memory: runnerMemory;
    actor: object;
    constructor(actor: object, memory: runnerMemory){
        this.actor = actor;
        this.memory = memory;
    }
    run(){
        if(this.memory.aQueue[0]){
            let aCurrentAction: Queueable = this.parseAction(this.memory.aQueue[0]);
            if(aCurrentAction.run(this.actor)){
                if(aCurrentAction.repeating){
                    this.queue(aCurrentAction);
                }
                this.next();
            }
        }
    }
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
        return new registrare[action.name](action.args, action.repeating, action.promiseId);
    }
    protected next(){
        this.memory.aQueue.shift();
    }
}
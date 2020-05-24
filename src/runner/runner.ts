import {Queueable, registrare} from '../queueable/queueable';

interface runnerMemory{aQueue: [string, Queueable][], aPromises: [Queueable, number][]}

class Runner{
    memory: runnerMemory;
    actor: object;
    constructor(actor: object, memory: runnerMemory){
        this.actor = actor;
        this.memory = memory;
    }
    run(){
        if(this.memory.aQueue[0]){
            let aCurrentAction: Queueable = new registrare[this.memory.aQueue[0][0]](this.memory.aQueue[0][1].args, this.memory.aQueue[0][1].repeating, this.memory.aQueue[0][1].promiseId);
            if(aCurrentAction.run(this.actor)){
                if(aCurrentAction.repeating){
                    this.queue(aCurrentAction);
                }
                this.next();
            }
        }
    }
    queue(action: Queueable){
        this.memory.aQueue.push([action.name, action]);
    }
    push(action: Queueable){
        this.memory.aQueue.unshift([action.name, action]);
    }
    clearQueue(){
        this.memory.aQueue = [];
    }
    private next(){
        this.memory.aQueue.shift();
    }
}
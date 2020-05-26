import {Runner, PromiseState, Queueable} from './runner';

export class JobRunner extends Runner{
    jobsPerTick: number;
    constructor(actor: object, memory: RunnerJobMemory, jobsPerTick: number = 1){
        super(actor, memory);
        //this.memory = memory;
        this.jobsPerTick = jobsPerTick;
    }
    run(){
        for(let i = 0; i < this.jobsPerTick; ++i){
            if(this.memory.aQueue[0]){
                let currentAction: Queueable = this.parseAction(this.memory.aQueue[0]);
                if(currentAction.run()){
                    if(currentAction.repeating){
                        this.queue(currentAction);
                    }
                }else{
                    this.queue(currentAction);
                }
                this.next()
            }
        }
        let jobsToRemove: boolean[] = [];
        for(let job in (<RunnerJobMemory>this.memory).aPriority){
            let currentAction: Queueable = this.parseAction((<RunnerJobMemory>this.memory).aPriority[job]);
            jobsToRemove.push(currentAction.run() && !currentAction.repeating);
        }
        for(let i = jobsToRemove.length - 1; i >= 0; --i){
            if(jobsToRemove[i]){
                (<RunnerJobMemory>this.memory).aPriority.splice(i, 1);
            }
        }
    }
    queuePriority(action: Queueable){
        action.start();
        (<RunnerJobMemory>this.memory).aPriority.push(action);
        this.memory.aPromises.push(action.promiseId);
    }
    pushPriority(action: Queueable){
        action.start();
        (<RunnerJobMemory>this.memory).aPriority.unshift(action);
        this.memory.aPromises.push(action.promiseId);
    }
    clearQueue(){
        for(let action of this.memory.aQueue){
            this.parseAction(action).end(PromiseState.ERR_PREEMPTED, true);
        }
        this.memory.aQueue = [];
        for(let action of (<RunnerJobMemory>this.memory).aPriority){
            this.parseAction(action).end(PromiseState.ERR_PREEMPTED, true);
        }
        (<RunnerJobMemory>this.memory).aPriority = [];
    }
}
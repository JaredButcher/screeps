import {Runner, Queueable} from '../runner/runner';

export class CreepRunner extends Runner{
    constructor(creep: Creep){
        super(creep, creep.memory);
    }
    run(){
        if(this.memory.aQueue[0]){
            let aCurrentAction: Queueable = this.parseAction(this.memory.aQueue[0]);
            if(aCurrentAction.run(this)){
                if(aCurrentAction.repeating){
                    this.queue(aCurrentAction);
                }
                this.next();
            }
        }
    }
}
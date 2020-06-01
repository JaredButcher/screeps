import {Manager, Task} from './manager';

export class Runner{
    memory: ManagerMemory;
    actor: object;
    manager: Manager;
    constructor(actor: object, memory: ManagerMemory){
        this.actor = actor;
        this.memory = memory;
        this.manager = new Manager(actor, memory);
    }
    run(){
        if(this.memory.aQueue.length > 0){
            let aCurrentAction: Task | null = this.getAction(this.memory.aQueue[0]);
            if(aCurrentAction && aCurrentAction.run()){
                if(aCurrentAction.repeating){
                    this.manager.queue(aCurrentAction);
                }
                this.manager.shift();
            }
        }
        let pJobsToKeep: Task[] = [];
        for(let pJob of this.memory.aPriority){
            let currentAction: Task | null = this.getAction(pJob);
            if(currentAction && (currentAction.run() || currentAction.repeating)){
                pJobsToKeep.push(currentAction);
            }
        }
        this.memory.aPriority = pJobsToKeep;
    }
    getAction(action: TaskMemory): Task | null{
        return new Task(this.manager, action.args, action.repeating, action.promiseId);
    }
}

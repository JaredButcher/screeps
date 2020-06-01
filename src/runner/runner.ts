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
            if(aCurrentAction){
                let result = aCurrentAction.run();
                if(result[1]){
                    this.manager.addPriority(aCurrentAction);
                    this.manager.shift();
                }else if(result[0]){
                    if(aCurrentAction.repeating){
                        this.manager.queue(aCurrentAction);
                    }
                    this.manager.shift();
                }
            }
        }
        let pJobsToKeep: Task[] = [];
        for(let pJob of this.memory.aPriority){
            let aCurrentAction: Task | null = this.getAction(pJob);
            if(aCurrentAction){
                let result = aCurrentAction.run();
                if(result[1]){
                    this.manager.queue(aCurrentAction);
                }else if(result[0]){
                    if(aCurrentAction.repeating){
                        pJobsToKeep.push(aCurrentAction);
                    }
                }else{
                    pJobsToKeep.push(aCurrentAction);
                }
            }
        }
        this.memory.aPriority = pJobsToKeep;
    }
    getAction(action: TaskMemory): Task | null{
        return new Task(this.manager, action.args, Task.name, action.repeating, action.promiseId);
    }
}

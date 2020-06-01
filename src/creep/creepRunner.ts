import {Runner} from '../runner/runner';
import {CreepTask, CreepManager, CreepTaskArgs} from './creepManager';
import {CreepTaskMoveTo} from './creepTaskMoveTo';

export class CreepRunner extends Runner{
    constructor(creep: Creep){
        super(creep, creep.memory);
    }
    getAction(action: CreepTask): CreepTask | null{
        let creep = <Creep>this.actor;
        if(creep.memory.aQueue.length > 0){
            let task: CreepTask;
            let taskMemory = creep.memory.aQueue[0];
            switch(taskMemory.name){
                case CreepTask.name:
                    return new CreepTask(this.manager, taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
                case CreepTaskMoveTo.name:
                    return new CreepTaskMoveTo(this.manager, taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
            }
        }
        return null;
    }

}
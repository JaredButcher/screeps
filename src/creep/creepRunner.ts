import {Runner} from '../runner/runner';
import {CreepTask, CreepManager, CreepTaskArgs} from './creepManager';
import {CreepTaskMoveTo} from './creepTaskMoveTo';
import {CreepTaskEmpty, CreepTaskArgsEmpty} from './creepTaskEmpty';
import {CreepTaskFill, CreepTaskArgsFill} from './creepTaskFill';
import {CreepTaskHarvest, CreepTaskArgsHarvest} from './creepTaskHarvest';
import {CreepTaskRepair, CreepTaskArgsRepair} from './creepTaskRepair';
import {CreepTaskRepairAuto, CreepTaskArgsRepairAuto} from './creepTaskRepairAuto';
import {CreepTaskUpgrade, CreepTaskArgsUpgrade} from './creepTaskUpgrade';
import {CreepTaskFerry, CreepTaskArgsFerry} from './creepTaskFerry';
import {CreepTaskBuildAuto, CreepTaskArgsBuildAuto} from './creepTaskBuildAuto';

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
                case CreepTaskEmpty.name:
                    return new CreepTaskEmpty(this.manager, <CreepTaskArgsEmpty>taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
                case CreepTaskFill.name:
                    return new CreepTaskFill(this.manager, <CreepTaskArgsFill>taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
                case CreepTaskHarvest.name:
                    return new CreepTaskHarvest(this.manager, <CreepTaskArgsHarvest>taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
                case CreepTaskRepair.name:
                    return new CreepTaskRepair(this.manager, <CreepTaskArgsRepair>taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
                case CreepTaskRepairAuto.name:
                    return new CreepTaskRepairAuto(this.manager, <CreepTaskArgsRepairAuto>taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
                case CreepTaskUpgrade.name:
                    return new CreepTaskUpgrade(this.manager, <CreepTaskArgsUpgrade>taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
                case CreepTaskFerry.name:
                    return new CreepTaskFerry(this.manager, <CreepTaskArgsFerry>taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
                case CreepTaskBuildAuto.name:
                    return new CreepTaskBuildAuto(this.manager, <CreepTaskArgsBuildAuto>taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
            }
        }
        return null;
    }

}
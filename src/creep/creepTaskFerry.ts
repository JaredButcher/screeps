import {registrare, PromiseState} from '../runner/runner';
import {CreepRunner} from './creepRunner';
import {CreepTask, CreepTaskArgs} from './CreepTask';
import {CreepTaskEmpty, CreepTaskArgsEmpty} from './creepTaskEmpty';
import {CreepTaskFill, CreepTaskArgsFill, StorageStructure} from './creepTaskFill';
import {fetchPromise} from '../utils';

export {StorageStructure};

export interface CreepTaskArgsFerry extends CreepTaskArgs{
    sourceIds?: Id<StorageStructure>[];
    destinationIds?: Id<AnyStoreStructure>[];
    fillPromise?: string;
    emptyPromise?: string;
    resourceType: ResourceConstant;
}

export class CreepTaskFerry extends CreepTask{
    constructor(runner: CreepRunner, args: CreepTaskArgsFerry, repeating: boolean = false, promiseId?: string){
        super(runner, args, repeating, promiseId);
    }
    run(): boolean{
        let args = <CreepTaskArgsFerry>this.args;
        if(!args.fillPromise && !args.emptyPromise){
            let emptyArgs: CreepTaskArgsEmpty = {
                resourceType: args.resourceType,
                targetIds: args.destinationIds
            }
            let emptyTask = new CreepTaskEmpty(this.runner, emptyArgs, false);
            args.emptyPromise = emptyTask.promiseId;
            this.runner.push(emptyTask);
            let fillArgs: CreepTaskArgsFill = {
                resourceType: args.resourceType,
                targetIds: args.sourceIds
            }
            let fillTask = new CreepTaskFill(this.runner, fillArgs, false);
            args.fillPromise = fillTask.promiseId;
            this.runner.push(fillTask);
            return false;
        }else{
            if(fetchPromise(<string>args.emptyPromise) == PromiseState.SUCESS && fetchPromise(<string>args.fillPromise) == PromiseState.SUCESS){
                this.end(PromiseState.SUCESS);
            }else{
                this.end(PromiseState.ERR_MISC_ERROR);
            }
            return true;
        }
    }
}

registrare["CreepTaskFerry"] = CreepTaskFerry;
import {CreepTask, CreepTaskArgs, CreepManager} from './creepManager';
import {CreepTaskEmpty, CreepTaskArgsEmpty} from './creepTaskEmpty';
import {CreepTaskFill, CreepTaskArgsFill, StorageStructure} from './creepTaskFill';
import {fetchPromise, PromiseState} from '../utils';

export {StorageStructure};

export interface CreepTaskArgsFerry extends CreepTaskArgs{
    sourceIds?: Id<StorageStructure>[];
    destinationIds?: Id<AnyStoreStructure>[];
    fillPromise?: string;
    emptyPromise?: string;
    resourceType: ResourceConstant;
}

export class CreepTaskFerry extends CreepTask{
    constructor(manager: CreepManager, args: CreepTaskArgsFerry, repeating: boolean = false, priority: boolean = false, promiseId?: string, name: string = CreepTaskFerry.name){
        super(manager, args, name, repeating, priority, promiseId);
    }
    run(): boolean{
        let args = <CreepTaskArgsFerry>this.args;
        if(!args.fillPromise && !args.emptyPromise){
            let emptyArgs: CreepTaskArgsEmpty = {
                resourceType: args.resourceType,
                targetIds: args.destinationIds
            }
            let emptyTask = new CreepTaskEmpty(this.manager, emptyArgs);
            args.emptyPromise = emptyTask.promiseId;
            this.manager.push(emptyTask);
            let fillArgs: CreepTaskArgsFill = {
                resourceType: args.resourceType,
                targetIds: args.sourceIds
            }
            let fillTask = new CreepTaskFill(this.manager, fillArgs);
            args.fillPromise = fillTask.promiseId;
            this.manager.push(fillTask);
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

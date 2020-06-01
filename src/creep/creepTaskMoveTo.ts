import {CreepTask, CreepTaskArgs, CreepManager} from './creepManager';
import {PromiseState} from '../utils';

export class CreepTaskMoveTo extends CreepTask{
    constructor(manager: CreepManager, args: CreepTaskArgs, repeating: boolean = false, promiseId?: string, name: string = CreepTaskMoveTo.name){
        super(manager, args, repeating, promiseId, name);
    }
    run(): boolean{
        if(super.run()){
            this.end(PromiseState.SUCESS);
            return true;
        }
        return false;
    }
}

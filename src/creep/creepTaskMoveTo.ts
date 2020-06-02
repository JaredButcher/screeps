import {CreepTask, CreepTaskArgs, CreepManager} from './creepManager';
import {PromiseState} from '../utils';

export class CreepTaskMoveTo extends CreepTask{
    constructor(manager: CreepManager, args: CreepTaskArgs, repeating: boolean = false, promiseId?: string, name: string = CreepTaskMoveTo.name){
        super(manager, args, name, repeating, promiseId);
    }
    run(): [boolean, boolean]{
        if(super.run()[0]){
            this.end(PromiseState.SUCESS);
            return [true, false];
        }
        return [false, false];
    }
}

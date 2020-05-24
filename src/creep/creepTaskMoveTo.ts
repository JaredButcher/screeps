import {registrare, PromiseState} from '../runner/runner';
import {CreepRunner} from './creepRunner';
import {CreepTask} from './CreepTask';

export class CreepTaskMoveTo extends CreepTask{
    run(runner: CreepRunner): boolean{
        if(super.run(runner)){
            this.end(PromiseState.SUCESS);
            return true;
        }
        return false;
    }
}

registrare["CreepTaskMoveTo"] = CreepTaskMoveTo;
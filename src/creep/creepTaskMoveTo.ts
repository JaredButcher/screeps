import {registrare} from '../runner/runner';
import {CreepRunner} from './creepRunner';
import {CreepTask} from './CreepTask';
import {PromiseState} from '../enums';

export class CreepTaskMoveTo extends CreepTask{
    run(): boolean{
        if(super.run()){
            this.end(PromiseState.SUCESS);
            return true;
        }
        return false;
    }
}

registrare["CreepTaskMoveTo"] = CreepTaskMoveTo;
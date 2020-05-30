import {registrare} from '../runner/runner';
import {CreepRunner} from './creepRunner';
import {CreepTask} from './CreepTask';

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
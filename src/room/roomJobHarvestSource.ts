import {Queueable, registrare} from '../runner/runner';
import {RoomRunner} from './roomRunner';
import {RoomJobArgs, RoomJob} from './roomJob';

export interface RoomJobHarvestSourceArgs extends RoomJobArgs{
    
}

export class RoomJobHarvestSource extends RoomJob{
    constructor(runner: RoomRunner, args: RoomJobHarvestSourceArgs, repeating: boolean = false, promiseId?: string){
        super(runner, args, repeating, promiseId);
    }
    run(){
        
        return false;
    }
}

registrare["RoomJobHarvestSource"] = RoomJobHarvestSource;
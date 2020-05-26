import {Queueable, registrare} from '../runner/runner';
import {RoomRunner} from './roomRunner';

export interface RoomJobArgs{
    awaiting?: boolean
}

export class RoomJob extends Queueable{
    constructor(runner: RoomRunner, args: RoomJobArgs, repeating: boolean = false, promiseId?: string){
        super(runner, args, repeating, promiseId);
    }
}

registrare["RoomJob"] = RoomJob;
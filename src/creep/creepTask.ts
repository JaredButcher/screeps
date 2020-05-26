import {Queueable, registrare, Runner, PromiseState} from '../runner/runner';
import {CreepRunner} from './creepRunner';

export interface CreepTaskArgs{
    x?: number;
    y?: number;
    roomName?: string;
    range?: number;
}

export class CreepTask extends Queueable{
    constructor(runner: CreepRunner, args: CreepTaskArgs, repeating: boolean = false, promiseId?: string){
        super(runner, args, repeating, promiseId);
    }
    run(): boolean{
        let args = <CreepTaskArgs>this.args;
        if(args.x && args.y && args.roomName){
            if(args.range === undefined) args.range = 0;
            let creep = <Creep>this.runner.actor;
            if(creep.room.name == args.roomName && Math.abs(creep.pos.x - args.x) <= args.range && 
                Math.abs(creep.pos.y - args.y) <= args.range){
                return true
            }else{
                creep.moveTo(new RoomPosition(args.x, args.y, args.roomName));
                return false;
            } 
        }
        return true;
    }
}

registrare["CreepTask"] = CreepTask;
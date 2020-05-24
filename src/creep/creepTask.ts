import {Queueable, registrare, Runner, PromiseState} from '../runner/runner';
import {CreepRunner} from './creepRunner';

export interface CreepTaskArgs{
    x: number;
    y: number;
    range: number;
    target?: string;
}

export class CreepTask extends Queueable{
    constructor(args: CreepTaskArgs, repeating: boolean = false, promiseId?: string){
        super(args, repeating, promiseId);
    }
    run(runner: CreepRunner): boolean{
        let creep = <Creep>runner.actor;
        let args = <CreepTaskArgs>this.args;
        if(Math.abs(creep.pos.x - args.x) <= args.range && Math.abs(creep.pos.y - args.y) <= args.range){
            return true
        }else{
            creep.moveTo(args.x, args.y);
            return false;
        } 
    }
}

registrare["CreepTask"] = CreepTask;
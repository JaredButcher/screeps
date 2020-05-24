import {registrare, PromiseState} from '../runner/runner';
import {CreepRunner} from './creepRunner';
import {CreepTask, CreepTaskArgs} from './CreepTask';

export interface CreepTaskArgsRepair extends CreepTaskArgs{
    targetId: Id<Structure>;
    untilHits?: number;
}

export class CreepTaskRepair extends CreepTask{
    constructor(args: CreepTaskArgsRepair, repeating: boolean = false, promiseId?: string){
        let target: Structure = <Structure>Game.getObjectById(args.targetId);
        args.x = target.pos.x;
        args.y = target.pos.y;
        args.roomName = target.pos.roomName;
        args.range = 3;
        super(args, repeating, promiseId);
    }
    run(runner: CreepRunner): boolean{
        if(super.run(runner)){
            let creep = <Creep>runner.actor;
            let args = <CreepTaskArgsRepair>this.args;
            let target: Structure = <Structure>Game.getObjectById(args.targetId);
            let status: ScreepsReturnCode = creep.repair(target);
            if(status == ERR_NOT_ENOUGH_RESOURCES){
                this.end(PromiseState.ERR_LACK_RESOURCE);
                return true;
            }
            if(status == OK){
                if(target.hits == target.hitsMax ||
                    (args.untilHits && target.hits >= args.untilHits)){
                    this.end(PromiseState.SUCESS);
                    return true;
                }else{
                    return false;
                }
            }
            this.end(PromiseState.ERR_MISC_ERROR);
            return true;
        }
        return false;
    }
}

registrare["CreepTaskRepair"] = CreepTaskRepair;
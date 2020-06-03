import {CreepTask, CreepTaskArgs, CreepManager} from './creepManager';
import {PromiseState} from '../utils';

export interface CreepTaskArgsRepair extends CreepTaskArgs{
    targetId: Id<Structure>;
    untilHits?: number;
}

export class CreepTaskRepair extends CreepTask{
    constructor(manager: CreepManager, args: CreepTaskArgsRepair, repeating: boolean = false, priority: boolean = false, promiseId?: string, name: string = CreepTaskRepair.name){
        let target: Structure = <Structure>Game.getObjectById(args.targetId);
        args.x = target.pos.x;
        args.y = target.pos.y;
        args.roomName = target.pos.roomName;
        args.range = 3;
        super(manager, args, name, repeating, priority, promiseId);
    }
    run(): boolean{
        if(super.run()){
            let creep = <Creep>this.manager.actor;
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

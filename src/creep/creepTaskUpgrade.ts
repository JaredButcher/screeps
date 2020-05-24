import {registrare, PromiseState} from '../runner/runner';
import {CreepRunner} from './creepRunner';
import {CreepTask, CreepTaskArgs} from './CreepTask';

export interface CreepTaskArgsUpgrade extends CreepTaskArgs{
    targetId: Id<StructureController>;
}

export class CreepTaskUpgrade extends CreepTask{
    constructor(args: CreepTaskArgsUpgrade, repeating: boolean = false, promiseId?: string){
        let target: StructureController = <StructureController>Game.getObjectById(args.targetId);
        args.x = target.pos.x;
        args.y = target.pos.y;
        args.roomName = target.pos.roomName;
        args.range = 3;
        super(args, repeating, promiseId);
    }
    run(runner: CreepRunner): boolean{
        if(super.run(runner)){
            let creep = <Creep>runner.actor;
            let args = <CreepTaskArgsUpgrade>this.args;
            let target: StructureController = <StructureController>Game.getObjectById(args.targetId);
            let status: ScreepsReturnCode = creep.upgradeController(target);
            if(status == ERR_NOT_ENOUGH_RESOURCES){
                this.end(PromiseState.ERR_LACK_RESOURCE);
                return true;
            }
            if(status == OK){
                return false;
            }
            this.end(PromiseState.ERR_MISC_ERROR);
            return true;
        }
        return false;
    }
}

registrare["CreepTaskUpgrade"] = CreepTaskUpgrade;
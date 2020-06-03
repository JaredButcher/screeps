import {CreepTask, CreepTaskArgs, CreepManager} from './creepManager';
import {PromiseState} from '../utils';

export interface CreepTaskArgsUpgrade extends CreepTaskArgs{
    targetId: Id<StructureController>;
}

export class CreepTaskUpgrade extends CreepTask{
    constructor(manager: CreepManager, args: CreepTaskArgsUpgrade, repeating: boolean = false, priority: boolean = false, promiseId?: string, name: string = CreepTaskUpgrade.name){
        let target: StructureController = <StructureController>Game.getObjectById(args.targetId);
        args.x = target.pos.x;
        args.y = target.pos.y;
        args.roomName = target.pos.roomName;
        args.range = 3;
        super(manager, args, name, repeating, priority, promiseId);
    }
    run(): boolean{
        if(super.run()){
            let creep = <Creep>this.manager.actor;
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

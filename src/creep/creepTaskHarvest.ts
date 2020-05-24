import {registrare, PromiseState} from '../runner/runner';
import {CreepRunner} from './creepRunner';
import {CreepTask, CreepTaskArgs} from './CreepTask';

export interface CreepTaskArgsHarvest extends CreepTaskArgs{
    untilSourceEmpty?: boolean;
    untilAmount?: number;
    resourceType: ResourceConstant;
    targetId: Id<HarvestTarget>;
}

type HarvestTarget = Source | Mineral<MineralConstant> | Deposit;

export class CreepTaskHarvest extends CreepTask{
    constructor(args: CreepTaskArgsHarvest, repeating: boolean = false, promiseId?: string){
        let target: HarvestTarget = <HarvestTarget>Game.getObjectById(args.targetId);
        args.x = target.pos.x;
        args.y = target.pos.y;
        args.roomName = target.pos.roomName;
        args.range = 1;
        super(args, repeating, promiseId);
    }
    run(runner: CreepRunner): boolean{
        if(super.run(runner)){
            let creep = <Creep>runner.actor;
            let args = <CreepTaskArgsHarvest>this.args;
            if(creep.store.getFreeCapacity(args.resourceType) == 0){
                this.end(PromiseState.SUCESS);
                return true;
            }
            let status: ScreepsReturnCode = creep.harvest(<HarvestTarget>Game.getObjectById(args.targetId));
            if(status != OK && status != ERR_NOT_ENOUGH_RESOURCES){
                this.end(PromiseState.SUCESS);
                return true;
            }
            if(status == ERR_NOT_ENOUGH_RESOURCES && args.untilSourceEmpty ||
                args.untilAmount && creep.store.getFreeCapacity(args.resourceType) >= args.untilAmount){
                this.end(PromiseState.SUCESS);
                return true;
            }
        }
        return false;
    }
}

registrare["CreepTaskHarvest"] = CreepTaskHarvest;
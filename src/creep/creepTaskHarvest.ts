import {registrare, PromiseState} from '../runner/runner';
import {CreepRunner} from './creepRunner';
import {CreepTask, CreepTaskArgs} from './CreepTask';

export interface CreepTaskArgsHarvest extends CreepTaskArgs{
    untilSourceEmpty?: boolean;
    untilAmount?: number;
    resourceType: ResourceConstant;
}

type HarvestTarget = Source | Mineral<MineralConstant> | Deposit;

export class CreepTaskHarvest extends CreepTask{
    constructor(args: CreepTaskArgsHarvest, repeating: boolean = false, promiseId?: string){
        super(args, repeating, promiseId);
    }
    run(runner: CreepRunner): boolean{
        let creep = <Creep>runner.actor;
        let args = <CreepTaskArgsHarvest>this.args;
        if(super.run(runner)){
            if(creep.store.getFreeCapacity(args.resourceType) == 0){
                this.end(PromiseState.SUCESS);
                return true;
            }
            let status: ScreepsReturnCode = creep.harvest(<HarvestTarget>Game.getObjectById(<Id<HarvestTarget>>(args.target)));
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
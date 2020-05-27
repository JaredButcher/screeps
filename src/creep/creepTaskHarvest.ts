import {registrare, PromiseState} from '../runner/runner';
import {CreepRunner} from './creepRunner';
import {CreepTask, CreepTaskArgs} from './CreepTask';

export interface CreepTaskArgsHarvest extends CreepTaskArgs{
    untilSourceEmpty?: boolean;
    untilAmount?: number;
    resourceType: ResourceConstant;
    targetId: Id<HarvestTarget>;
    drop?: Id<DropTarget>;
}

type HarvestTarget = Source | Mineral<MineralConstant> | Deposit;
export type DropTarget = Structure<STRUCTURE_CONTAINER> | Structure<STRUCTURE_LINK>;

export class CreepTaskHarvest extends CreepTask{
    constructor(runner: CreepRunner, args: CreepTaskArgsHarvest, repeating: boolean = false, promiseId?: string){
        let target: HarvestTarget = <HarvestTarget>Game.getObjectById(args.targetId);
        args.x = target.pos.x;
        args.y = target.pos.y;
        args.roomName = target.pos.roomName;
        args.range = 1;
        super(runner, args, repeating, promiseId);
    }
    run(): boolean{
        if(super.run()){
            let creep = <Creep>this.runner.actor;
            let args = <CreepTaskArgsHarvest>this.args;
            let status: ScreepsReturnCode = creep.harvest(<HarvestTarget>Game.getObjectById(args.targetId));
            if(args.drop){
                let target = <DropTarget>Game.getObjectById(args.drop);
                creep.transfer(target, args.resourceType);
            }else if(creep.store.getFreeCapacity(args.resourceType) == 0){
                this.end(PromiseState.SUCESS);
                return true;
            }
            if((status == ERR_NOT_ENOUGH_RESOURCES || status == ERR_TIRED) && args.untilSourceEmpty ||
                args.untilAmount && creep.store.getFreeCapacity(args.resourceType) >= args.untilAmount){
                this.end(PromiseState.SUCESS);
                return true;
            }
            if(status != OK && status != ERR_NOT_ENOUGH_RESOURCES && status != ERR_TIRED){
                this.end(PromiseState.ERR_MISC_ERROR);
                return true;
            }
        }
        return false;
    }
}

registrare["CreepTaskHarvest"] = CreepTaskHarvest;
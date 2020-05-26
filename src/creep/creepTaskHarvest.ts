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
            if(creep.store.getFreeCapacity(args.resourceType) == 0){
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
    start(){
        let creep = <Creep>this.runner.actor;
        let args = <CreepTaskArgsHarvest>this.args;
        let target = <HarvestTarget>Game.getObjectById(args.targetId);
        if(target.room){
            target.room.memory.sources[<Id<Source>>args.targetId].harvesters.push(creep.id);
        }
        super.start();
    }
    end(status: PromiseState, force = false){
        if(!this.repeating || force){
            let creep = <Creep>this.runner.actor;
            let args = <CreepTaskArgsHarvest>this.args;
            let target = <HarvestTarget>Game.getObjectById(args.targetId);
            if(target.room){
                target.room.memory.sources[<Id<Source>>args.targetId].harvesters = 
                    target.room.memory.sources[<Id<Source>>args.targetId].harvesters.filter((x) => x != creep.id);
            }
            super.end(status);
        }
    }
}

registrare["CreepTaskHarvest"] = CreepTaskHarvest;
import {registrare} from '../runner/runner';
import {CreepRunner} from './creepRunner';
import {CreepTask, CreepTaskArgs} from './CreepTask';
import {CreepTaskFill} from './creepTaskFill';
import {PromiseState} from '../enums';

export interface CreepTaskArgsRepairAuto extends CreepTaskArgs{
    targetId?: Id<Structure>;
    untilHits: number;
}

export class CreepTaskRepairAuto extends CreepTask{
    constructor(runner: CreepRunner, args: CreepTaskArgsRepairAuto, repeating: boolean = false, promiseId?: string){
        super(runner, args, repeating, promiseId);
    }
    run(): boolean{
        let creep = <Creep>this.runner.actor;
        let runner = <CreepRunner>this.runner;
        let args = <CreepTaskArgsRepairAuto>this.args;
        if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0){
            runner.push(new CreepTaskFill(runner, {resourceType: RESOURCE_ENERGY}));
            return false;
        }
        if(!args.targetId){
            //find target
            let targets = creep.room.find(FIND_STRUCTURES, {filter: (x) => 
                x.hits < x.hitsMax / 2 && x.structureType != STRUCTURE_WALL && x.structureType != STRUCTURE_RAMPART ||
                x.hits < args.untilHits && (x.structureType == STRUCTURE_WALL || x.structureType == STRUCTURE_RAMPART)});
            let target = creep.pos.findClosestByRange(targets);
            if(target){
                args.targetId = target.id;
                args.x = target.pos.x;
                args.y = target.pos.y;
                args.roomName = target.pos.roomName;
                args.range = 3;
            }else{
                this.end(PromiseState.SUCESS);
                return true;
            }    
        }else if(super.run()){
            //Repair
            let target = <Structure>Game.getObjectById(<Id<Structure>>args.targetId);
            let status: ScreepsReturnCode = creep.repair(target);
            if(status == OK){
                if(target.hits == target.hitsMax ||
                    (args.untilHits && target.hits >= args.untilHits)){
                    args.targetId = undefined;
                }
            }
        }
        return false;
    }
}

registrare["CreepTaskRepairAuto"] = CreepTaskRepairAuto;
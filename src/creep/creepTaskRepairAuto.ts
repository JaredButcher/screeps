import {CreepTask, CreepTaskArgs, CreepManager} from './creepManager';
import {PromiseState} from '../utils';
import {CreepTaskFill} from './creepTaskFill';

export interface CreepTaskArgsRepairAuto extends CreepTaskArgs{
    targetId?: Id<Structure>;
    untilHits: number;
}

export class CreepTaskRepairAuto extends CreepTask{
    constructor(manager: CreepManager, args: CreepTaskArgsRepairAuto, repeating: boolean = false, promiseId?: string, name: string = CreepTaskRepairAuto.name){
        super(manager, args, repeating, promiseId);
    }
    run(): boolean{
        let creep = <Creep>this.manager.actor;
        let manager = <CreepManager>this.manager;
        let args = <CreepTaskArgsRepairAuto>this.args;
        if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0){
            manager.push(new CreepTaskFill(manager, {resourceType: RESOURCE_ENERGY}));
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

import {registrare} from '../runner/runner';
import {RoomRunner} from './roomRunner';
import {RoomJobArgs, RoomJob} from './roomJob';
import {CreepRunner} from '../creep/creepRunner';
import {GeneralCreep} from '../creep/creepBody';
import {CreepTaskRepairAuto} from '../creep/creepTaskRepairAuto';
import {CreepTypes, CreepRoles} from '../enums';

export class RoomJobRepair extends RoomJob{
    constructor(runner: RoomRunner, args: RoomJobArgs, repeating: boolean = false, promiseId?: string){
        super(runner, args, repeating, promiseId);
    }
    run(){
        let room = <Room>this.runner.actor;
        let runner = <RoomRunner>this.runner;
        //Are we maxed out
        if(room.memory.creepRoles[CreepRoles.REPAIR].current.length < room.memory.creepRoles[CreepRoles.REPAIR].max){
            //Find structures in need of repair
            let wallTargetHits = Math.pow(2, ((<StructureController>room.controller).level + 7));
            let targets = room.find(FIND_STRUCTURES, {filter: (x) => 
                x.hits < x.hitsMax / 2 && x.structureType != STRUCTURE_WALL && x.structureType != STRUCTURE_RAMPART ||
                x.hits < wallTargetHits && (x.structureType == STRUCTURE_WALL || x.structureType == STRUCTURE_RAMPART)});
            //Do we already have a reasonable amount of repairers
            if(targets.length > room.memory.creepRoles[CreepRoles.REPAIR].current.length * 4){
                //Find / spawn creep
                let creepId = runner.findCreep(CreepTypes.GENERAL, true);
                if(creepId && !(creepId === true)){
                    let creep = <Creep>Game.getObjectById(creepId);
                    let creepRunner = new CreepRunner(creep);
                    creepRunner.clearQueue();
                    let repairTask = new CreepTaskRepairAuto(creepRunner, {untilHits: wallTargetHits});
                    creepRunner.queue(repairTask);
                    room.memory.creepRoles[CreepRoles.REPAIR].current.push({creep: creepId, promise: repairTask.promiseId});
                }else if(!creepId){
                    runner.queueSpawn(new GeneralCreep(runner.maxCreepCost()));
                }
            }
        }
        return false;
    }
    
}

registrare["RoomJobRepair"] = RoomJobRepair;
import {RoomTask, RoomManager, RoomTaskArgs} from './roomManager';
import {CreepManager} from '../creep/creepManager';
import {GeneralCreep} from '../creep/creepBody';
import {CreepTaskRepairAuto} from '../creep/creepTaskRepairAuto';
import {CreepTypes} from '../creep/creepUtils';
import {CreepRoles} from './roomUtils';

export class RoomTaskRepair extends RoomTask{
    constructor(manager: RoomManager, args: RoomTaskArgs, repeating: boolean = false, priority: boolean = false, promiseId?: string, name: string = RoomTaskRepair.name){
        super(manager, args, name, repeating, priority, promiseId);
    }
    run(): boolean{
        let room = <Room>this.manager.actor;
        let manager = <RoomManager>this.manager;
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
                let creepId = manager.findCreep(CreepTypes.GENERAL, true);
                if(creepId && !(creepId === true)){
                    let creep = <Creep>Game.getObjectById(creepId);
                    let creepRunner = new CreepManager(creep);
                    creepRunner.clearQueue();
                    let repairTask = new CreepTaskRepairAuto(creepRunner, {untilHits: wallTargetHits});
                    creepRunner.queue(repairTask);
                    room.memory.creepRoles[CreepRoles.REPAIR].current.push({creep: creepId, promise: repairTask.promiseId});
                }else if(!creepId){
                    manager.queueSpawn(new GeneralCreep(manager.maxCreepCost()));
                }
            }
        }
        return true;
    }
    
}

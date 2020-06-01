import {RoomTaskArgs, RoomManager, RoomTask} from './roomManager';
import {CreepManager} from '../creep/creepManager';
import {GeneralCreep} from '../creep/creepBody';
import {CreepTaskUpgrade} from '../creep/creepTaskUpgrade';
import {CreepTypes} from '../creep/creepUtils';
import {CreepRoles} from './roomUtils';

export class RoomTaskUpgrade extends RoomTask{
    constructor(manager: RoomManager, args: RoomTaskArgs, repeating: boolean = false, promiseId?: string){
        super(manager, args, repeating, promiseId);
        this.name = "RoomTaskUpgrade";
    }
    run(){
        let room = <Room>this.manager.actor;
        let manager = <RoomManager>this.manager;
        //Are we maxed out, if not make more
        if(room.memory.creepRoles[CreepRoles.UPGRADE].current.length < room.memory.creepRoles[CreepRoles.UPGRADE].max){
            let creepId = manager.findCreep(CreepTypes.GENERAL, true);
            if(creepId && !(creepId === true)){
                let creep = <Creep>Game.getObjectById(creepId);
                let creepManager = new CreepManager(creep);
                creepManager.clearQueue();
                let upgradeTask = new CreepTaskUpgrade(creepManager, {targetId: (<StructureController>room.controller).id});
                creepManager.queue(upgradeTask);
                room.memory.creepRoles[CreepRoles.UPGRADE].current.push({creep: creepId, promise: upgradeTask.promiseId});
            }else if(!creepId){
                manager.queueSpawn(new GeneralCreep(manager.maxCreepCost()));
            }
        }
        return false;
    }
    
}

import {RoomTaskArgs, RoomManager, RoomTask} from './roomManager';
import {CreepManager} from '../creep/creepManager';
import {GeneralCreep} from '../creep/creepBody';
import {CreepTaskUpgrade} from '../creep/creepTaskUpgrade';
import {CreepTypes} from '../creep/creepUtils';
import {CreepRoles} from './roomUtils';
import { CreepTaskFill } from 'creep/creepTaskFill';

export class RoomTaskUpgrade extends RoomTask{
    constructor(manager: RoomManager, args: RoomTaskArgs, repeating: boolean = false, priority: boolean = false, promiseId?: string, name: string = RoomTaskUpgrade.name){
        super(manager, args, name, repeating, priority, promiseId);
    }
    run(): boolean{
        let room = <Room>this.manager.actor;
        let manager = <RoomManager>this.manager;
        //Are we maxed out, if not make more
        if(room.memory.creepRoles[CreepRoles.UPGRADE].current.length < room.memory.creepRoles[CreepRoles.UPGRADE].max){
            let creepId = manager.findCreep(CreepTypes.GENERAL, true);
            if(creepId && !(creepId === true)){
                let creep = <Creep>Game.getObjectById(creepId);
                let creepManager = new CreepManager(creep);
                creepManager.clearQueue();
                creepManager.queue(new CreepTaskFill(creepManager, {resourceType: RESOURCE_ENERGY}));
                let upgradeTask = new CreepTaskUpgrade(creepManager, {targetId: (<StructureController>room.controller).id});
                creepManager.queue(upgradeTask);
                room.memory.creepRoles[CreepRoles.UPGRADE].current.push({creep: creepId, promise: upgradeTask.promiseId});
            }else if(!creepId){
                manager.queueSpawn(new GeneralCreep(manager.maxCreepCost()));
            }
        }
        return true;
    }
    
}

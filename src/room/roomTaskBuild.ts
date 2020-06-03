import {CreepManager} from '../creep/creepManager';
import {GeneralCreep} from '../creep/creepBody';
import {CreepTaskBuildAuto} from '../creep/creepTaskBuildAuto';
import {CreepTypes} from '../creep/creepUtils';
import {CreepRoles} from './roomUtils';
import {RoomTask, RoomManager, RoomTaskArgs} from './roomManager';
import { PromiseState } from 'utils';

export class RoomTaskBuild extends RoomTask{
    constructor(manager: RoomManager, args: RoomTaskArgs, repeating: boolean = false, priority: boolean = false, promiseId?: string, name: string = RoomTaskBuild.name){
        super(manager, args, name, repeating, priority, promiseId);
    }
    run(): boolean{
        let room = <Room>this.manager.actor;
        let manager = <RoomManager>this.manager;
        //Are we maxed out
        if(room.memory.creepRoles[CreepRoles.BUILD].current.length < room.memory.creepRoles[CreepRoles.BUILD].max){
            //Find structures in need of building
            let targets = room.find(FIND_CONSTRUCTION_SITES).length + manager.getConstructionSiteFlags().length;
            //Do we already have a reasonable amount of builders
            if(targets > room.memory.creepRoles[CreepRoles.BUILD].current.length * 4){
                //Find / spawn creep
                let creepId = manager.findCreep(CreepTypes.GENERAL, true);
                if(creepId && !(creepId === true)){
                    let creep = <Creep>Game.getObjectById(creepId);
                    let creepRunner = new CreepManager(creep);
                    creepRunner.clearQueue();
                    let buildTask = new CreepTaskBuildAuto(creepRunner, {});
                    creepRunner.queue(buildTask);
                    room.memory.creepRoles[CreepRoles.BUILD].current.push({creep: creepId, promise: buildTask.promiseId});
                }else if(!creepId){
                    manager.queueSpawn(new GeneralCreep(manager.maxCreepCost()));
                }
            }
        }
        this.end(PromiseState.SUCESS);
        return true;
    }
}

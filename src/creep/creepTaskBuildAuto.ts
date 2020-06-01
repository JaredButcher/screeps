import {CreepTask, CreepTaskArgs, CreepManager} from './creepManager';
import {PromiseState} from '../utils';
import {CreepTaskFill} from './creepTaskFill';
import {RoomManager} from '../room/roomManager';

export interface CreepTaskArgsBuildAuto extends CreepTaskArgs{
    targetId?: Id<ConstructionSite>;
}

export class CreepTaskBuildAuto extends CreepTask{
    constructor(manager: CreepManager, args: CreepTaskArgsBuildAuto, repeating: boolean = false, promiseId?: string, name: string = CreepTaskBuildAuto.name){
        super(manager, args, repeating, promiseId, name);
    }
    run(): boolean{
        let creep = <Creep>this.manager.actor;
        let manager = <CreepManager>this.manager;
        let args = <CreepTaskArgsBuildAuto>this.args;
        if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0){
            manager.push(new CreepTaskFill(manager, {resourceType: RESOURCE_ENERGY}));
            return false;
        }
        //Make sure it is still a construction site to save a tick
        if(args.targetId){
            let target = Game.getObjectById(<Id<ConstructionSite>>args.targetId);
            if(!target) args.targetId = undefined;
        }
        if(!args.targetId){
            //find target
            let roomManager = new RoomManager(creep.room, creep.room.memory);
            let targetFlag = creep.pos.findClosestByRange(roomManager.getConstructionSiteFlags());
            let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if(target){
                args.targetId = target.id;
                args.x = target.pos.x;
                args.y = target.pos.y;
                args.roomName = target.pos.roomName;
                args.range = 3;
            }else if(targetFlag){
                roomManager.activateConstructionSite(targetFlag);
            }else{
                this.end(PromiseState.SUCESS);
                return true;
            }    
        }else if(super.run()){
            //Repair
            let target = Game.getObjectById(<Id<ConstructionSite>>args.targetId);
            creep.build(<ConstructionSite>target);
        }
        return false;
    }
}

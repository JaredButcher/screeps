import {registrare, PromiseState} from '../runner/runner';
import {CreepRunner} from './creepRunner';
import {CreepTask, CreepTaskArgs} from './CreepTask';
import {CreepTaskFill} from './creepTaskFill';
import {getConstructionSiteFlags, activateConstructionSite} from '../room/roomUtils'

export interface CreepTaskBuildAutoArgs extends CreepTaskArgs{
    targetId?: Id<ConstructionSite>;
}

export class CreepTaskBuildAuto extends CreepTask{
    constructor(runner: CreepRunner, args: CreepTaskBuildAutoArgs, repeating: boolean = false, promiseId?: string){
        super(runner, args, repeating, promiseId);
    }
    run(): boolean{
        let creep = <Creep>this.runner.actor;
        let runner = <CreepRunner>this.runner;
        let args = <CreepTaskBuildAutoArgs>this.args;
        if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0){
            runner.push(new CreepTaskFill(runner, {resourceType: RESOURCE_ENERGY}));
            return false;
        }
        //Make sure it is still a construction site to save a tick
        if(args.targetId){
            let target = Game.getObjectById(<Id<ConstructionSite>>args.targetId);
            if(!target) args.targetId = undefined;
        }
        if(!args.targetId){
            //find target
            let targetFlag = creep.pos.findClosestByRange(getConstructionSiteFlags(creep.room));
            let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if(target){
                args.targetId = target.id;
                args.x = target.pos.x;
                args.y = target.pos.y;
                args.roomName = target.pos.roomName;
                args.range = 3;
            }else if(targetFlag){
                activateConstructionSite(creep.room, targetFlag);
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

registrare["CreepTaskBuildAuto"] = CreepTaskBuildAuto;
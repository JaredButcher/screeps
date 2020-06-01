import {registrare} from '../runner/runner';
import {RoomRunner} from './roomRunner';
import {RoomJobArgs, RoomJob} from './roomJob';
import {CreepRunner} from '../creep/creepRunner';
import {GeneralCreep} from '../creep/creepBody';
import {CreepTaskBuildAuto} from '../creep/creepTaskBuildAuto';
import {getConstructionSiteFlags} from './roomUtils';
import {CreepTypes, CreepRoles} from '../enums';

export class RoomJobBuild extends RoomJob{
    constructor(runner: RoomRunner, args: RoomJobArgs, repeating: boolean = false, promiseId?: string){
        super(runner, args, repeating, promiseId);
    }
    run(){
        let room = <Room>this.runner.actor;
        let runner = <RoomRunner>this.runner;
        //Are we maxed out
        if(room.memory.creepRoles[CreepRoles.BUILD].current.length < room.memory.creepRoles[CreepRoles.BUILD].max){
            //Find structures in need of building
            let targets = room.find(FIND_CONSTRUCTION_SITES).length + getConstructionSiteFlags(room).length;
            //Do we already have a reasonable amount of builders
            if(targets > room.memory.creepRoles[CreepRoles.BUILD].current.length * 4){
                //Find / spawn creep
                let creepId = runner.findCreep(CreepTypes.GENERAL, true);
                if(creepId && !(creepId === true)){
                    let creep = <Creep>Game.getObjectById(creepId);
                    let creepRunner = new CreepRunner(creep);
                    creepRunner.clearQueue();
                    let buildTask = new CreepTaskBuildAuto(creepRunner, {});
                    creepRunner.queue(buildTask);
                    room.memory.creepRoles[CreepRoles.BUILD].current.push({creep: creepId, promise: buildTask.promiseId});
                }else if(!creepId){
                    runner.queueSpawn(new GeneralCreep(runner.maxCreepCost()));
                }
            }
        }
        return false;
    }
    
}

registrare["RoomJobBuild"] = RoomJobBuild;
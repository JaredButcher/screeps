import {registrare} from '../runner/runner';
import {RoomRunner} from './roomRunner';
import {RoomJobArgs, RoomJob} from './roomJob';
import {CreepRunner} from '../creep/creepRunner';
import {GeneralCreep} from '../creep/creepBody';
import {CreepTaskUpgrade} from '../creep/creepTaskUpgrade';

export class RoomJobUpgrade extends RoomJob{
    constructor(runner: RoomRunner, args: RoomJobArgs, repeating: boolean = false, promiseId?: string){
        super(runner, args, repeating, promiseId);
    }
    run(){
        let room = <Room>this.runner.actor;
        let runner = <RoomRunner>this.runner;
        //Are we maxed out, if not make more
        if(room.memory.creepRoles[CreepRoles.UPGRADE].current.length < room.memory.creepRoles[CreepRoles.UPGRADE].max){
            let creepId = runner.findCreep(CreepTypes.GENERAL, true);
            if(creepId && !(creepId === true)){
                let creep = <Creep>Game.getObjectById(creepId);
                let creepRunner = new CreepRunner(creep);
                creepRunner.clearQueue();
                let upgradeTask = new CreepTaskUpgrade(creepRunner, {targetId: (<StructureController>room.controller).id});
                creepRunner.queue(upgradeTask);
                room.memory.creepRoles[CreepRoles.UPGRADE].current.push({creep: creepId, promise: upgradeTask.promiseId});
            }else if(!creepId){
                runner.queueSpawn(new GeneralCreep(runner.maxCreepCost()));
            }
        }
        return false;
    }
    
}

registrare["RoomJobUpgrade"] = RoomJobUpgrade;
import {registrare} from '../runner/runner';
import {RoomRunner} from './roomRunner';
import {RoomJobArgs, RoomJob} from './roomJob';
import {CreepRunner} from '../creep/creepRunner';
import {GeneralCreep} from '../creep/creepBody';
import {CreepTaskBuildAuto} from '../creep/creepTaskBuildAuto';
import {getConstructionSiteFlags} from './roomUtils';

export class RoomJobDefense extends RoomJob{
    constructor(runner: RoomRunner, args: RoomJobArgs, repeating: boolean = false, promiseId?: string){
        super(runner, args, repeating, promiseId);
    }
    run(){
        let room = <Room>this.runner.actor;
        let runner = <RoomRunner>this.runner;
        let hostiles = room.find(FIND_HOSTILE_CREEPS);
        if(hostiles){
            //Move to priority queue if defcon rises above 0
            if(room.memory.defcon == 0){
                room.memory.defcon = 1;
                runner.queuePriority(this)
                return true;
            }
            //Choose target hostile
            let target: [Creep, number] | null = null;
            let totalValue = 0;
            for(let hostile of hostiles){
                let value = 0;
                if(room.memory.corePlaced){
                    value = Math.max(0, 20 - hostile.pos.getRangeTo(room.memory.corePos.x, room.memory.corePos.y));
                }else{
                    value = Math.max(0, 20 - Math.max(Math.abs(hostile.pos.x - 25), Math.abs(hostile.pos.y - 25)))
                }
                for(let part of hostile.body){
                    if(part.type == ATTACK){
                        value += 1;
                    }else if(part.type == RANGED_ATTACK){
                        value += 3;
                    }else if(part.type == HEAL){
                        value += 3;
                    }
                }
                if(!target || target[1] < value){
                    target = [hostile, value];
                }
                totalValue += value;
            }
            if(totalValue > 10 && room.memory.defcon == 1){
                room.memory.defcon = 2;
            }else if(totalValue > 30 && room.memory.defcon == 2){
                room.memory.defcon = 3;
            }
            //Find towers and attack
            if(target){
                let towers = <StructureTower[]>room.find(FIND_MY_STRUCTURES, {filter: x => x.structureType == STRUCTURE_TOWER});
                for(let tower of towers){
                    if(tower.store.getUsedCapacity(RESOURCE_ENERGY) < tower.store.getCapacity(RESOURCE_ENERGY) / 3 && room.memory.defcon < 3){
                        tower.attack(target[0]);
                    }
                }
            }
        }else{
            //If defcon returns to 0, move to normal queue
            if(room.memory.defcon > 0){
                room.memory.defcon = 0;
                runner.queue(this)
                return true;
            }    
        }    
        return false;
    }
    
}

registrare["RoomJobDefense"] = RoomJobDefense;
import {RoomTask, RoomManager, RoomTaskArgs} from './roomManager';

export class RoomTaskDefense extends RoomTask{
    constructor(manager: RoomManager, args: RoomTaskArgs, repeating: boolean = false, priority: boolean = false, promiseId?: string, name: string = RoomTaskDefense.name){
        super(manager, args, name, repeating, priority, promiseId);
    }
    run(): boolean{
        let room = <Room>this.manager.actor;
        let manager = <RoomManager>this.manager;
        let hostiles = room.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0){
            //Move to priority queue if defcon rises above 0
            if(room.memory.defcon == 0){
                room.memory.defcon = 1;
                this.priority = true;
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
                this.priority = false;
                return true;
            }    
        }    
        return true;
    }
    
}

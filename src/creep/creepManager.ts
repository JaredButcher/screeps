import {Task, Manager} from '../runner/manager';

export interface CreepTaskArgs{
    x?: number;
    y?: number;
    roomName?: string;
    range?: number;
}

export class CreepTask extends Task{
    constructor(manager: CreepManager, args: CreepTaskArgs, repeating: boolean = false, promiseId?: string, name: string = CreepTask.name){
        super(manager, args, repeating, promiseId, name);
    }
    run(): boolean{
        let args = <CreepTaskArgs>this.args;
        if(args.x && args.y && args.roomName){
            if(args.range === undefined) args.range = 0;
            let creep = <Creep>this.manager.actor;
            if(creep.room.name == args.roomName && Math.abs(creep.pos.x - args.x) <= args.range && 
                Math.abs(creep.pos.y - args.y) <= args.range){
                return true
            }else{
                creep.moveTo(new RoomPosition(args.x, args.y, args.roomName));
                return false;
            } 
        }
        return true;
    }
}

export class CreepManager extends Manager{
    constructor(actor: Room, memory: ManagerMemory){
        super(actor, memory);
    }
    queue(action: CreepTask){
        super.queue(action);
    }
    queuePriority(action: CreepTask){
        super.queuePriority(action);
    }
}

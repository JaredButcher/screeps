import {Task, Manager} from '../runner/manager';

export interface CreepTaskArgs{
    x?: number;
    y?: number;
    roomName?: string;
    range?: number;
}

export class CreepTask extends Task{
    constructor(manager: CreepManager, args: CreepTaskArgs, name: string, repeating: boolean = false, priority: boolean = false, promiseId?: string){
        super(manager, args, name, repeating, priority, promiseId);
    }
    run(): boolean{
        let args = <CreepTaskArgs>this.args;
        if(args.x && args.y && args.roomName){
            if(args.range === undefined) args.range = 0;
            let creep = <Creep>this.manager.actor;
            if(creep.room.name == args.roomName && Math.abs(creep.pos.x - args.x) <= args.range && 
                Math.abs(creep.pos.y - args.y) <= args.range){
                return true;
            }else{
                creep.moveTo(new RoomPosition(args.x, args.y, args.roomName));
                return false;
            } 
        }
        return true;
    }
}

export class CreepManager extends Manager{
    constructor(actor: Creep){
        super(actor, actor.memory);
    }
    queue(action: CreepTask){
        super.queue(action);
    }
    push(task: CreepTask){
        super.push(task);
    }
}

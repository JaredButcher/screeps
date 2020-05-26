import {JobRunner} from '../runner/jobRunner';
import {CreepBody} from '../creep/creepBody';

interface CreepSpawnable{
    body: BodyPartConstant[];
    cost: number;
    bodyType: string;
}

export class RoomRunner extends JobRunner{
    spawnQueue: CreepSpawnable[];
    constructor(room: Room){
        super(room, room.memory);
        this.spawnQueue = [];
    }
}
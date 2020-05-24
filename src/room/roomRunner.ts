import {JobRunner} from '../runner/jobRunner';

export class RoomRunner extends JobRunner{
    constructor(room: Room){
        super(room, room.memory);
        this.run();
    }
}
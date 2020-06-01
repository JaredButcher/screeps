import {Runner} from '../runner/runner';

export class RoomRunner extends Runner{
    constructor(room: Room){
        super(room, room.memory);
    }
    run(){
        
    }
}
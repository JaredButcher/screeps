import {Runner} from '../runner/runner';
import {RoomManager, RoomTask, RoomTaskArgs} from './roomManager';
import {RoomTaskUpgrade} from './roomTaskUpgrade'

export class RoomRunner extends Runner{
    constructor(room: Room){
        super(room, room.memory);
    }
    getAction(taskMemory: TaskMemory): RoomTask | null{
        let manager = <RoomManager>this.manager;
        switch(taskMemory.name){
            case RoomTask.name:
                return new RoomTask(manager, taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
            case RoomTaskUpgrade.name:
                return new RoomTaskUpgrade(manager, taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
        }
        return null;
    }
}
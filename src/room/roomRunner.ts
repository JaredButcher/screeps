import {Runner} from '../runner/runner';
import {RoomManager, RoomTask, RoomTaskArgs} from './roomManager';
import {RoomTaskUpgrade} from './roomTaskUpgrade'
import {RoomTaskBuild} from './roomTaskBuild';
import {RoomTaskDefense} from './roomTaskDefense';
import {RoomTaskHarvestSource, RoomTaskHarvestSourceArgs} from './roomTaskHarvestSource';
import {RoomTaskSpawn} from './roomTaskSpawn';
import {RoomTaskPlan} from './roomTaskPlan';
import {RoomTaskRepair} from './roomTaskRepair';

export class RoomRunner extends Runner{
    constructor(room: Room){
        super(room, room.memory, new RoomManager(room));
    }
    getAction(taskMemory: TaskMemory): RoomTask | null{
        let manager = <RoomManager>this.manager;
        switch(taskMemory.name){
            case RoomTaskUpgrade.name:
                return new RoomTaskUpgrade(manager, taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
            case RoomTaskBuild.name:
                return new RoomTaskBuild(manager, taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
            case RoomTaskDefense.name:
                return new RoomTaskDefense(manager, taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
            case RoomTaskHarvestSource.name:
                return new RoomTaskHarvestSource(manager, <RoomTaskHarvestSourceArgs>taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
            case RoomTaskSpawn.name:
                return new RoomTaskSpawn(manager, taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
            case RoomTaskPlan.name:
                return new RoomTaskPlan(manager, taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
            case RoomTaskRepair.name:
                return new RoomTaskRepair(manager, taskMemory.args, taskMemory.repeating, taskMemory.promiseId);
        }
        return null;
    }
}
import {RoomTask, RoomManager, RoomTaskArgs} from './roomManager';
import {fetchPromise} from '../utils';
import {isFlagOfType, flagTypes} from 'flags';
import {PromiseState} from '../utils';
import {CreepRoles} from './roomUtils';

export class RoomTaskEcon extends RoomTask{
    constructor(manager: RoomManager, args: RoomTaskArgs, repeating: boolean = false, priority: boolean = false, promiseId?: string, name: string = RoomTaskEcon.name){
        super(manager, args, name, repeating, priority, promiseId);
    }
    run(): boolean{
        let room = <Room>this.manager.actor;
        return true;        
    }
}

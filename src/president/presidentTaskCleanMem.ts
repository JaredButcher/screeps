import {PresidentTask, PresidentManager, PresidentTaskArgs} from './presidentManager';
import {cleanMemory} from '../manageMemory';

export class PresidentTaskCleanMem extends PresidentTask{
    constructor(manager: PresidentManager, args: PresidentTaskArgs, repeating: boolean = false, priority: boolean = false, promiseId?: string, name: string = PresidentTaskCleanMem.name){
        super(manager, args, name, repeating, priority, promiseId);
    }
    run(): boolean{
        cleanMemory();
        return true;
    }
}

import {Task, Manager} from '../runner/manager';

export interface DistrictTaskArgs{}

export class DistrictTask extends Task{
    constructor(manager: DistrictManager, args: DistrictTaskArgs, name: string, repeating: boolean = false, promiseId?: string){
        super(manager, args, name, repeating, promiseId);
    }
}

export class DistrictManager extends Manager{
    constructor(memory: DisctrictMemory){
        super({}, memory);
    }
    queue(action: DistrictTask){
        super.queue(action);
    }
    addPriority(action: DistrictTask){
        super.addPriority(action);
    }
}

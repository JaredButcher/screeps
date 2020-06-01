import {Task, Manager} from '../runner/manager';

export interface PresidentTaskArgs{}

export class PresidentTask extends Task{
    constructor(manager: PresidentManager, args: PresidentTaskArgs, name: string, repeating: boolean = false, promiseId?: string){
        super(manager, args, name, repeating, promiseId);
    }
}

export class PresidentManager extends Manager{
    constructor(){
        super({}, Memory.president);
    }
    queue(action: PresidentTask){
        super.queue(action);
    }
    addPriority(action: PresidentTask){
        super.addPriority(action);
    }
}

import {Task, Manager} from '../runner/manager';

export interface PresidentTaskArgs{}

export class PresidentTask extends Task{
    constructor(manager: PresidentManager, args: PresidentTaskArgs, name: string, repeating: boolean = false, priority: boolean = false, promiseId?: string){
        super(manager, args, name, repeating, priority, promiseId);
    }
}

export class PresidentManager extends Manager{
    constructor(){
        super({}, Memory.president);
    }
    queue(action: PresidentTask){
        super.queue(action);
    }
    push(task: PresidentTask){
        super.push(task);
    }
}

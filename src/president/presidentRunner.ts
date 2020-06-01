import {Runner} from '../runner/runner';
import {PresidentManager, PresidentTask} from './presidentManager';


export class PresidentRunner extends Runner{
    constructor(){
        super({}, Memory.president);
    }
    getAction(taskMemory: TaskMemory): PresidentTask | null{
        let manager = <PresidentManager>this.manager;
        switch(taskMemory.name){
        }
        return null;
    }
}
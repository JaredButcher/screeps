import {Runner} from '../runner/runner';
import {DistrictManager, DistrictTask} from './districtManager';


export class DistrictRunner extends Runner{
    constructor(memory: DisctrictMemory){
        super({}, memory);
    }
    getAction(taskMemory: TaskMemory): DistrictTask | null{
        let manager = <DistrictManager>this.manager;
        switch(taskMemory.name){
        }
        return null;
    }
}
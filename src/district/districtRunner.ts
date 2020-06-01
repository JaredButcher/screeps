import {Runner} from '../runner/runner';

export class DistrictRunner extends Runner{
    constructor(memory: TaskManagerMemory){
        super({}, memory);
    }
}
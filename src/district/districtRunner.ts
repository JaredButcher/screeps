import {JobRunner} from '../runner/jobRunner';

export class DistrictRunner extends JobRunner{
    constructor(memory: RunnerJobMemory){
        super({}, memory);
        this.run();
    }
}
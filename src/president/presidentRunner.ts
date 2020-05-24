import {JobRunner} from '../runner/jobRunner';

export class PresidentRunner extends JobRunner{
    constructor(){
        super({}, Memory.president);
        this.run();
    }
}
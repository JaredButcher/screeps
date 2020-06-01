import {Runner} from '../runner/runner';

export class PresidentRunner extends Runner{
    constructor(){
        super({}, Memory.president);
    }
}
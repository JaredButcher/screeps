import {Queueable, registrare} from '../runner/runner';
import {RoomRunner} from './roomRunner';
import {RoomJobArgs, RoomJob} from './roomJob';
import {fetchPromise, PromiseState} from '../utils';

export class RoomJobValidateEnergy extends RoomJob{
    constructor(runner: RoomRunner, args: RoomJobArgs, repeating: boolean = false, promiseId?: string){
        super(runner, args, repeating, promiseId);
    }
    run(){
        let room = <Room>this.runner.actor;
        let crashing: boolean = true;
        for(let source of room.find(FIND_SOURCES)){
            let sourceEntry = room.memory.sources[source.id];
            //Remove expired harvester entries 
            let validEntries: CreepPromiseMemory[] = [];
            for(let harvester of sourceEntry.harvesters){
                if(fetchPromise(harvester.promise) == PromiseState.RUNNING){
                    validEntries.push(harvester);
                }
            }
            sourceEntry.harvesters = validEntries;
            //Remvoe invalid transportors
            validEntries = []
            for(let transportor of sourceEntry.transporters){
                if(fetchPromise(transportor.promise) == PromiseState.RUNNING){
                    validEntries.push(transportor);
                }
            }
            sourceEntry.transporters = validEntries;
            if(sourceEntry.harvesters.length != 0 && (sourceEntry.containerId != undefined || sourceEntry.transporters.length > 0)){
                crashing = false;
            }
        }
        room.memory.crashRecovery = crashing;
        return false;
    }
}

registrare["RoomJobValidateEnergy"] = RoomJobValidateEnergy;
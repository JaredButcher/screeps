import {registrare} from '../runner/runner';
import {RoomRunner} from './roomRunner';
import {RoomJobArgs, RoomJob} from './roomJob';
import {fetchPromise, PromiseState} from '../utils';

export class RoomJobPlan extends RoomJob{
    constructor(runner: RoomRunner, args: RoomJobArgs, repeating: boolean = false, promiseId?: string){
        super(runner, args, repeating, promiseId);
    }
    run(){
        let room = <Room>this.runner.actor;
        let crashing: boolean = true;
        //Check that sources are covered to prevent crashing
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
            if(sourceEntry.harvesters.length != 0){
                crashing = false;
            }
            //Make sure not crashing
            if(sourceEntry.harvesters.length != 0){
                crashing = false;
            }
            //Remove expired other entries 
            validEntries = [];
            for(let creep of sourceEntry.otherUsers){
                if(fetchPromise(creep.promise) == PromiseState.RUNNING){
                    validEntries.push(creep);
                }
            }
            sourceEntry.otherUsers = validEntries;
        }
        room.memory.crashRecovery = crashing;
        //Check other roles for expired creeps
        for(let key in room.memory.creepRoles){
            let roleInfo = room.memory.creepRoles[key];
            let validCreeps: CreepPromiseMemory[] = [];
            for(let creep of roleInfo.current){
                let promise = fetchPromise(creep.promise);
                if(promise == PromiseState.RUNNING) validCreeps.push(creep);
            }
            roleInfo.current = validCreeps;
        }
        //Set creep goles and maxes
        
        //Build structures
        return false;
    }
}

registrare["RoomJobPlan"] = RoomJobPlan;
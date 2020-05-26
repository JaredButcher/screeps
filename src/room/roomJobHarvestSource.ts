import {Queueable, registrare} from '../runner/runner';
import {RoomRunner} from './roomRunner';
import {RoomJobArgs, RoomJob} from './roomJob';
import {fetchPromise, PromiseState} from '../utils';

export interface RoomJobHarvestSourceArgs extends RoomJobArgs{
    sourceId: Id<Source>;
}

export class RoomJobHarvestSource extends RoomJob{
    constructor(runner: RoomRunner, args: RoomJobHarvestSourceArgs, repeating: boolean = false, promiseId?: string){
        super(runner, args, repeating, promiseId);
    }
    run(){
        let args = <RoomJobHarvestSourceArgs>this.args;
        let room = <Room>this.runner.actor;
        let sourceEntry = room.memory.sources[args.sourceId];
        //Determin type of harvester / transporter is required
        let isDropMining = sourceEntry.containerId != undefined;
        if(room.memory.crashRecovery){
            //Create the required creeps of lower costs with highest priority
            if(isDropMining){

            }else{
                
            }
        }else{
            if(isDropMining){
                //General mining
            }else{
                //Drop mining

            }
        }
        //Find or queue creation of such
        return false;
    }
}

registrare["RoomJobHarvestSource"] = RoomJobHarvestSource;
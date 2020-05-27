import {Queueable, registrare} from '../runner/runner';
import {RoomRunner} from './roomRunner';
import {RoomJobArgs, RoomJob} from './roomJob';
import {fetchPromise, PromiseState} from '../utils';
import {CreepRunner} from '../creep/creepRunner';
import {CreepTaskEmpty} from '../creep/creepTaskEmpty';
import {CreepTaskMoveTo} from '../creep/creepTaskMoveTo';
import {CreepTaskHarvest, DropTarget} from '../creep/creepTaskHarvest';
import {HarvestCreep, GeneralCreep} from 'creep/creepBody';

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
        let runner = <RoomRunner>this.runner;
        let sourceEntry = room.memory.sources[args.sourceId];
        //Determin type of harvester / transporter is required
        let isDropMining = sourceEntry.containerId != undefined || sourceEntry.linkId != undefined;
        let currentCreep: Creep | null = sourceEntry.harvesters.length > 0 ? Game.getObjectById(sourceEntry.harvesters[0].creep) : null;
        if(isDropMining){
            //Drop mining
            //Transporter
            if(sourceEntry.containerId){
                //TODO - check if transporter is needed
                if(room.memory.crashRecovery){
                    //TODO
                }else{
                    //TODO
                }
            }
            //Harvester
            if(!currentCreep || <number>currentCreep.ticksToLive < 120){
                //In crises create the required creeps of lower costs with highest priority
                if(room.memory.crashRecovery){
                    let creep = runner.findCreep("HarvestCreep", false, false, true);
                    if(creep && !(creep === true)){
                        if(sourceEntry.linkId){
                            this.queueDropHarvest(creep, sourceEntry, args.sourceId, sourceEntry.linkId);
                        }else{
                            this.queueDropHarvest(creep, sourceEntry, args.sourceId, <Id<StructureContainer>>sourceEntry.containerId);
                        }
                    }else if(!creep){
                        runner.queueSpawn(new HarvestCreep(Math.max(runner.currentMaxCreepCost(), 300)), true);
                    }
                }else{
                    let creep = runner.findCreep("HarvestCreep", false, false, false, (<Source>Game.getObjectById(args.sourceId)).pos);
                    if(creep && !(creep === true)){
                        if(sourceEntry.linkId){
                            this.queueDropHarvest(creep, sourceEntry, args.sourceId, sourceEntry.linkId);
                        }else{
                            this.queueDropHarvest(creep, sourceEntry, args.sourceId, <Id<StructureContainer>>sourceEntry.containerId);
                        }
                    }else if(!creep){
                        runner.queueSpawn(new HarvestCreep(runner.maxCreepCost()));
                    }
                }
            }
        }else{
            //General mining
            if(!currentCreep || <number>currentCreep.ticksToLive < 120){
                //In crises create the required creeps of lower costs with highest priority
                if(room.memory.crashRecovery){
                    let creep = runner.findCreep("GeneraCreep", false, false, true);
                    if(creep && !(creep === true)){
                        this.queueGeneralHarvest(creep, sourceEntry, args.sourceId);
                    }else{
                        runner.queueSpawn(new GeneralCreep(Math.max(runner.currentMaxCreepCost(), 300)), true);
                    }
                }else{
                    let creep = runner.findCreep("GeneraCreep", false, false, false, (<Source>Game.getObjectById(args.sourceId)).pos);
                    if(creep && !(creep === true)){
                        this.queueGeneralHarvest(creep, sourceEntry, args.sourceId);
                    }else if(!creep){
                        runner.queueSpawn(new GeneralCreep(Math.min(runner.maxCreepCost(), 1200)));
                    }
                }
            }
        }
        //Find or queue creation of such
        return false;
    }
    queueGeneralHarvest(creep: Id<Creep>, sourceEntry: ResourceMemory, sourceId: Id<Source>){
        let creepRunner = new CreepRunner(<Creep>Game.getObjectById(creep));
        creepRunner.clearQueue();
        creepRunner.queue(new CreepTaskEmpty(creepRunner, {
            resourceType: RESOURCE_ENERGY
        }, true));
        let harvestTask = new CreepTaskHarvest(creepRunner, {
            resourceType: RESOURCE_ENERGY,
            targetId: sourceId
        }, true);
        creepRunner.queue(harvestTask);
        sourceEntry.harvesters.push({creep: creep, promise: harvestTask.promiseId});
    }
    queueDropHarvest(creep: Id<Creep>, sourceEntry: ResourceMemory, sourceId: Id<Source>, dropId: Id<DropTarget>){
        let creepRunner = new CreepRunner(<Creep>Game.getObjectById(creep));
        let target = <Source>Game.getObjectById(sourceId);
        let dropTarget = <DropTarget>Game.getObjectById(dropId);
        creepRunner.clearQueue();
        creepRunner.queue(new CreepTaskMoveTo(creepRunner, {
            x: target.pos.x,
            y: target.pos.y,
            roomName: target.pos.roomName,
            range: 1
        }));
        creepRunner.queue(new CreepTaskMoveTo(creepRunner, {
            x: dropTarget.pos.x,
            y: dropTarget.pos.y,
            roomName: dropTarget.pos.roomName,
            range: 1
        }));
        let harvestTask = new CreepTaskHarvest(creepRunner, {
            resourceType: RESOURCE_ENERGY,
            targetId: sourceId,
            drop: dropId
        }, true);
        creepRunner.queue(harvestTask);
        sourceEntry.harvesters.push({creep: creep, promise: harvestTask.promiseId});
    }
    queueTransport(creep: Id<Creep>, sourceEntry: ResourceMemory, sourceId: Id<StructureContainer>){
        //TODO
    }
}

registrare["RoomJobHarvestSource"] = RoomJobHarvestSource;
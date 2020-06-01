import {RoomTask, RoomManager, RoomTaskArgs} from './roomManager';
import {CreepManager} from '../creep/creepManager';
import {CreepTaskEmpty} from '../creep/creepTaskEmpty';
import {CreepTaskMoveTo} from '../creep/creepTaskMoveTo';
import {CreepTaskHarvest, DropTarget} from '../creep/creepTaskHarvest';
import {HarvestCreep, GeneralCreep} from 'creep/creepBody';
import {CreepTypes} from '../creep/creepUtils';

export interface RoomTaskHarvestSourceArgs extends RoomTaskArgs{
    sourceId: Id<Source>;
}

export class RoomTaskHarvestSource extends RoomTask{
    constructor(manager: RoomManager, args: RoomTaskHarvestSourceArgs, repeating: boolean = false, promiseId?: string, name: string = RoomTaskHarvestSource.name){
        super(manager, args, name, repeating, promiseId);
    }
    run(): [boolean, boolean]{
        let args = <RoomTaskHarvestSourceArgs>this.args;
        let room = <Room>this.manager.actor;
        let manager = <RoomManager>this.manager;
        let sourceEntry = room.memory.sources[args.sourceId];
        //Determin type of harvester / transporter is required
        let isDropMining = sourceEntry.containerId != undefined || sourceEntry.linkId != undefined;
        let currentCreep: Creep | null = sourceEntry.harvesters.length > 0 ? Game.getObjectById(sourceEntry.harvesters[0].creep) : null;
        if(isDropMining){
            //Drop mining
            //Harvester
            if(!currentCreep || <number>currentCreep.ticksToLive < 120){
                //In crises create the required creeps of lower costs with highest priority
                if(room.memory.crashRecovery){
                    let creep = manager.findCreep(CreepTypes.HARVEST, false, false, true);
                    if(creep && !(creep === true)){
                        if(sourceEntry.linkId){
                            this.queueDropHarvest(creep, sourceEntry, args.sourceId, sourceEntry.linkId);
                        }else{
                            this.queueDropHarvest(creep, sourceEntry, args.sourceId, <Id<StructureContainer>>sourceEntry.containerId);
                        }
                    }else if(!creep){
                        manager.queueSpawn(new HarvestCreep(Math.max(manager.currentMaxCreepCost(), 300)), true);
                    }
                }else{
                    let creep = manager.findCreep(CreepTypes.HARVEST, false, false, false, (<Source>Game.getObjectById(args.sourceId)).pos);
                    if(creep && !(creep === true)){
                        if(sourceEntry.linkId){
                            this.queueDropHarvest(creep, sourceEntry, args.sourceId, sourceEntry.linkId);
                        }else{
                            this.queueDropHarvest(creep, sourceEntry, args.sourceId, <Id<StructureContainer>>sourceEntry.containerId);
                        }
                    }else if(!creep){
                        manager.queueSpawn(new HarvestCreep(manager.maxCreepCost()));
                    }
                }
            }
        }else{
            //General mining
            if(!currentCreep || <number>currentCreep.ticksToLive < 120){
                //In crises create the required creeps of lower costs with highest priority
                if(room.memory.crashRecovery){
                    let creep = manager.findCreep(CreepTypes.HARVEST, false, false, true);
                    if(creep && !(creep === true)){
                        this.queueGeneralHarvest(creep, sourceEntry, args.sourceId);
                    }else{
                        manager.queueSpawn(new GeneralCreep(Math.max(manager.currentMaxCreepCost(), 300)), true);
                    }
                }else{
                    let creep = manager.findCreep(CreepTypes.HARVEST, false, false, false, (<Source>Game.getObjectById(args.sourceId)).pos);
                    if(creep && !(creep === true)){
                        this.queueGeneralHarvest(creep, sourceEntry, args.sourceId);
                    }else if(!creep){
                        manager.queueSpawn(new GeneralCreep(Math.min(manager.maxCreepCost(), 1200)));
                    }
                }
            }
        }
        //Find or queue creation of such
        return [true, false];
    }
    queueGeneralHarvest(creep: Id<Creep>, sourceEntry: ResourceMemory, sourceId: Id<Source>){
        let creeep = <Creep>Game.getObjectById(creep);
        let creepManager = new CreepManager(creeep);
        creepManager.clearQueue();
        creepManager.queue(new CreepTaskEmpty(creepManager, {
            resourceType: RESOURCE_ENERGY
        }, true));
        let harvestTask = new CreepTaskHarvest(creepManager, {
            resourceType: RESOURCE_ENERGY,
            targetId: sourceId
        }, true);
        creepManager.queue(harvestTask);
        sourceEntry.harvesters.push({creep: creep, promise: harvestTask.promiseId});
    }
    queueDropHarvest(creep: Id<Creep>, sourceEntry: ResourceMemory, sourceId: Id<Source>, dropId: Id<DropTarget>){
        let creeep = <Creep>Game.getObjectById(creep);
        let creepManager = new CreepManager(creeep);
        let target = <Source>Game.getObjectById(sourceId);
        let dropTarget = <DropTarget>Game.getObjectById(dropId);
        creepManager.clearQueue();
        creepManager.queue(new CreepTaskMoveTo(creepManager, {
            x: target.pos.x,
            y: target.pos.y,
            roomName: target.pos.roomName,
            range: 1
        }));
        creepManager.queue(new CreepTaskMoveTo(creepManager, {
            x: dropTarget.pos.x,
            y: dropTarget.pos.y,
            roomName: dropTarget.pos.roomName,
            range: 1
        }));
        let harvestTask = new CreepTaskHarvest(creepManager, {
            resourceType: RESOURCE_ENERGY,
            targetId: sourceId,
            drop: dropId
        }, true);
        creepManager.queue(harvestTask);
        sourceEntry.harvesters.push({creep: creep, promise: harvestTask.promiseId});
    }
}

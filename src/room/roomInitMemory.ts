import {RoomRunner} from './roomRunner';
import {RoomJobHarvestSource} from './roomJobHarvestSource';
import {RoomJobDefense} from './roomJobDefense';
import {RoomJobBuild} from './roomJobBuild';
import {RoomJobRepair} from './roomJobRepair';
import {RoomJobUpgrade} from './roomJobUpgrade';
import {RoomJobSpawn} from './roomJobSpawn';
import {RoomJobPlan} from './roomJobPlan';

export function initRoomMemory(room: Room) {
    room.memory.inited = true;
    room.memory.crashRecovery = false;
    room.memory.lastLevel = 0;
    room.memory.corePlaced = false;
    room.memory.defcon = 0;
    if(room.controller){
        room.memory.corePos = room.controller.pos
    }else{
        room.memory.corePos = {x: 0, y: 0, roomName: room.name};
    }
    room.memory.spawnQueue = [];
    room.memory.spawning = {};
    room.memory.deposits = {};
    for(let deposit of room.find(FIND_DEPOSITS)){
        room.memory.deposits[deposit.id] = {hasContainer: false, hasRoad: false, hasLink: false, harvesters: [], otherUsers: []};
    }
    room.memory.minerals = {};
    for(let mineral of room.find(FIND_MINERALS)){
        room.memory.minerals[mineral.id] = {hasContainer: false, hasRoad: false, hasLink: false, harvesters: [], otherUsers: []};
    }
    for(let role in CreepRoles){
        room.memory.creepRoles[role] = {current: [], max: 0};
    }
    let runner = new RoomRunner(room);
    room.memory.sources = {};
    for(let source of room.find(FIND_SOURCES)){
        room.memory.sources[source.id] = {hasContainer: false, hasRoad: false, hasLink: false, harvesters: [], otherUsers: []};
        runner.queue(new RoomJobHarvestSource(runner, {sourceId: source.id}));
    }
    runner.queue(new RoomJobPlan(runner, {}));
    runner.queue(new RoomJobDefense(runner, {}));
    runner.queue(new RoomJobBuild(runner, {}));
    runner.queue(new RoomJobRepair(runner, {}));
    runner.queue(new RoomJobUpgrade(runner, {}));
    runner.queue(new RoomJobSpawn(runner, {}));
}
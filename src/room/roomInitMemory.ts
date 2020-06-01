import {RoomRunner} from './roomRunner';
import {RoomJobHarvestSource} from './roomJobHarvestSource';
import {RoomJobDefense} from './roomJobDefense';
import {RoomJobBuild} from './roomJobBuild';
import {RoomJobRepair} from './roomJobRepair';
import {RoomJobUpgrade} from './roomTaskUpgrade';
import {RoomJobSpawn} from './roomJobSpawn';
import {RoomJobPlan} from './roomJobPlan';
import {CreepRoles} from './roomUtils';

export function initRoomMemory(room: Room) {
    let roomMem: RoomMemory = {
        inited: true,
        crashRecovery: false,
        lastLevel: 0,
        corePlaced: false,
        defcon: 0,
        spawnQueue: [],
        spawning: {},
        deposits: {},
        aPriority: [],
        aQueue: [],
        aPromises: [],
        creepRoles: {},
        minerals:{},
        corePos: {x: 0, y: 0, roomName: room.name},
        sources: {}
    }
    room.memory = roomMem;
    
    if(room.controller){
        room.memory.corePos = {x: room.controller.pos.x, y: room.controller.pos.y, roomName: room.name};
    }
    for(let deposit of room.find(FIND_DEPOSITS)){
        room.memory.deposits[deposit.id] = {hasContainer: false, hasRoad: false, hasLink: false, harvesters: [], otherUsers: []};
    }
    
    for(let mineral of room.find(FIND_MINERALS)){
        room.memory.minerals[mineral.id] = {hasContainer: false, hasRoad: false, hasLink: false, harvesters: [], otherUsers: []};
    }
    for(let role in CreepRoles){
        room.memory.creepRoles[role] = {current: [], max: 0};
    }
    
    let runner = new RoomRunner(room);
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
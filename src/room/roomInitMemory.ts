import {RoomManager} from './roomManager';
import {RoomTaskHarvestSource} from './roomTaskHarvestSource';
import {RoomTaskDefense} from './roomTaskDefense';
import {RoomTaskBuild} from './roomTaskBuild';
import {RoomTaskRepair} from './roomTaskRepair';
import {RoomTaskUpgrade} from './roomTaskUpgrade';
import {RoomTaskSpawn} from './roomTaskSpawn';
import {RoomTaskPlan} from './roomTaskPlan';
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
    
    let roomManager = new RoomManager(room);
    for(let source of room.find(FIND_SOURCES)){
        room.memory.sources[source.id] = {hasContainer: false, hasRoad: false, hasLink: false, harvesters: [], otherUsers: []};
        roomManager.queue(new RoomTaskHarvestSource(roomManager, {sourceId: source.id}));
    }
    roomManager.queue(new RoomTaskPlan(roomManager, {}));
    roomManager.queue(new RoomTaskDefense(roomManager, {}));
    roomManager.queue(new RoomTaskBuild(roomManager, {}));
    roomManager.queue(new RoomTaskRepair(roomManager, {}));
    roomManager.queue(new RoomTaskUpgrade(roomManager, {}));
    roomManager.queue(new RoomTaskSpawn(roomManager, {}));
}
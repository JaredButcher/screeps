// Type definitions for Screeps 3.1
// Project: https://github.com/screeps/screeps
// Definitions by: Marko Sulamägi <https://github.com/MarkoSulamagi>
//                 Nhan Ho <https://github.com/NhanHo>
//                 Bryan <https://github.com/bryanbecker>
//                 Resi Respati <https://github.com/resir014>
//                 Adam Laycock <https://github.com/Arcath>
//                 Dominic Marcuse <https://github.com/dmarcuse>
//                 Skyler Kehren <https://github.com/pyrodogg>
//                 Kieran Carnegie <https://github.com/kotarou>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

// Please contribute types to https://github.com/screepers/typed-screeps

//Memory at 2933

// Game Constants

declare var global: any;

enum CreepTypes{
    GENERAL = "GENERAL",
    HARVEST = "HARVEST",
    TRANSPORT = "TRANSPORT",
    CLAIM = "CLAIM"
}
enum CreepRoles{
    HARVEST = "HARVEST", 
    REPAIR = "REPAIR", 
    UPGRADE = "UPGRADE", 
    TRANSPORT = "TRANSPORT", 
    BUILD = "BUILD"
}

enum PromiseState {RUNNING, SUCESS, ERR_DEAD, ERR_INVALID_ARGS, 
    ERR_INVALID_TARGET, ERR_LACK_RESOURCE, ERR_PREEMPTED, ERR_MISC_ERROR};

interface Memory {
    inited: boolean;
    promiseCount: number;
    creepCount: number;
    promises: {[id: string]: {status: PromiseState, age: number}};
    districts: {[name: string]: DisctrictMemory};
    creeps: {[name: string]: CreepMemory};
    powerCreeps: {[name: string]: PowerCreepMemory};
    flags: {[name: string]: FlagMemory};
    rooms: {[name: string]: RoomMemory};
    spawns: {[name: string]: SpawnMemory};
    president: PresidentMemory;
}

interface RunnerMemory{
    aQueue: Queueable[];
    aPromises: string[];
}
interface RunnerJobMemory extends RunnerMemory{
    aPriority: Queueable[];
}
interface CreepPromiseMemory{
    creep: string;
    promise: string;
}
interface ResourceMemory{
    hasContainer: boolean;
    containerId?: Id<StructureContainer>;
    harvesters: CreepPromiseMemory[];
    otherUsers: CreepPromiseMemory[];
    hasRoad: boolean;
    hasLink: boolean;
    linkId?: Id<StructureLink>;  
}
interface CreepBodyMemory{
    bodyType: CreepTypes;
    body: BodyPartConstant[];
    cost: number;
    priority: boolean;
}

interface CreepMemory extends RunnerMemory {
    inited: boolean;
    bodyType: CreepTypes;
}
interface FlagMemory {}
interface ConstructionSiteFlagMemory extends FlagMemory{
    siteType: StructureConstant;
}
interface PowerCreepMemory {}
interface RoomMemory extends RunnerJobMemory{
    inited: boolean;
    sources: {[id: string]: ResourceMemory};
    minerals: {[id: string]: ResourceMemory};
    deposits: {[id: string]: ResourceMemory};
    crashRecovery: boolean;
    lastLevel: number;
    defcon: number;
    corePos: {x: number, y: number, roomName: string};
    corePlaced: boolean;
    spawnQueue: CreepBodyMemory[];
    spawning: {[id: string]: CreepBodyMemory};
    creepRoles: {[key: string]: {current: CreepPromiseMemory[], max: number}};

}
interface SpawnMemory {}
interface DisctrictMemory extends RunnerJobMemory {
    inited: boolean;
    name: string;
    rooms: string[];
}
interface PresidentMemory extends RunnerJobMemory {}

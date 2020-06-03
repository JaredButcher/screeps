declare var global: any;

interface Memory {
    inited: boolean;
    pause: boolean;
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

interface TaskMemory{
    promiseId: string;
    repeating: boolean;
    args: object;
    name: string;
    priority: boolean;
}

interface ManagerMemory{
    taskQueue: TaskMemory[];
    taskPromises: string[];
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

interface CreepMemory extends ManagerMemory {
    inited: boolean;
    bodyType: CreepTypes;
}
interface FlagMemory {}
interface ConstructionSiteFlagMemory extends FlagMemory{
    siteType: StructureConstant;
}
interface PowerCreepMemory {}
interface RoomMemory extends ManagerMemory{
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
interface DisctrictMemory extends ManagerMemory {
    inited: boolean;
    name: string;
    rooms: string[];
}
interface PresidentMemory extends ManagerMemory {}

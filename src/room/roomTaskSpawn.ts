import {RoomTask, RoomManager, RoomTaskArgs} from './roomManager';

export class RoomTaskSpawn extends RoomTask{
    constructor(manager: RoomManager, args: RoomTaskArgs, repeating: boolean = false, promiseId?: string, name: string = RoomTaskSpawn.name){
        super(manager, args, name, repeating, promiseId);
    }
    run(): [boolean, boolean]{
        let room = <Room>this.manager.actor;
        let spawnQueue = room.memory.spawnQueue;
        //Remove creeps that have finished spawning
        let spawnsToRemove: Id<STRUCTURE_SPAWN>[] = [];
        for(let spawnId in room.memory.spawning){
            if(!(<StructureSpawn>Game.getObjectById(spawnId)).spawning){
                spawnsToRemove.push(<Id<STRUCTURE_SPAWN>>spawnId);
            }
        }
        for(let spawnId of spawnsToRemove){
            delete room.memory.spawning[spawnId];
        }
        //See if able to build current creep and build it
        if(spawnQueue.length > 0){
            let spawns = room.find(FIND_MY_SPAWNS, {filter: (x) => !x.spawning});
            if(spawns.length > 0){
                let name = spawnQueue[0].bodyType.toString() + Memory.creepCount;
                if(spawns[0].spawnCreep(spawnQueue[0].body, name, {dryRun: true}) == OK){
                    spawns[0].spawnCreep(spawnQueue[0].body, name, {memory: {
                        bodyType: spawnQueue[0].bodyType, 
                        inited: true,
                        aQueue: [],
                        aPromises: [],
                        aPriority: []
                    }});
                    ++Memory.creepCount;
                    room.memory.spawning[spawns[0].id] = spawnQueue[0];
                    spawnQueue.shift();
                }
            }
        }
        return [true, false];
    }
}

'use strict';
import {CreepRunner} from './creep/creepRunner';
import {RoomRunner} from './room/roomRunner';
import {DistrictRunner} from './district/districtRunner';
import {PresidentRunner} from './president/presidentRunner';
import {cleanMemory, initMemory} from './manageMemory';
import {attach} from './consoleCommands';

export function loop(){
    if(!Memory.inited){
        console.log("INIT MEMORY")
        initMemory();
    }
    attach();
    new PresidentRunner().run();
    for(let district in Memory.districts){
        new DistrictRunner(Memory.districts[district]).run();
    }
    for(let roomName in Game.rooms){
        new RoomRunner(Game.rooms[roomName]).run();
    }
    for(let creepId in Game.creeps){
        let creep = <Creep>Game.getObjectById(creepId);
        if(!creep.spawning) new CreepRunner(creep).run();
    }
    cleanMemory();
}
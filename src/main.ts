'use strict';
import {CreepRunner} from './creep/creepRunner';
import {RoomRunner} from './room/roomRunner';
import {DistrictRunner} from './district/districtRunner';
import {PresidentRunner} from './president/presidentRunner';
import {cleanMemory, initMemory} from './manageMemory';
import {attach} from './consoleCommands';

export function loop(){
    if(Memory.pause) return;
    if(!Memory.inited){
        console.log("INIT MEMORY")
        initMemory();
    }
    console.log(1)
    attach();
    console.log(2)
    new PresidentRunner().run();
    console.log(3)
    for(let district in Memory.districts){
        new DistrictRunner(Memory.districts[district]).run();
    }
    console.log(4)
    for(let roomName in Game.rooms){
        new RoomRunner(Game.rooms[roomName]).run();
    }
    console.log(5)
    for(let creepId in Game.creeps){
        let creep = <Creep>Game.getObjectById(creepId);
        if(!creep.spawning) new CreepRunner(creep).run();
    }
    console.log(6)
}
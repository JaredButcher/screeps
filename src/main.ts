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
    //initMemory();
    attach();
    new PresidentRunner().run();
    for(let district in Memory.districts){
        new DistrictRunner(Memory.districts[district]).run();
    }
    for(let roomName in Game.rooms){
        new RoomRunner(Game.rooms[roomName]).run();
    }
    for(let creepName in Game.creeps){
        let creep = Game.creeps[creepName];
        if(!creep.spawning) new CreepRunner(creep).run();
    }
}
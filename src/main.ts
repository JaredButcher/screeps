'use strict';
import {CreepRunner} from './creep/creepRunner';
import {RoomRunner} from './room/roomRunner';
import {DistrictRunner} from './district/districtRunner';
import {PresidentRunner} from './president/presidentRunner';
import {cleanMemory, initMemory} from './utils';

export function loop(){
    if(!Memory.inited){
        initMemory();
    }
    new PresidentRunner().run();
    for(let district in Memory.districts){
        new DistrictRunner(Memory.districts[district]).run();
    }
    for(let roomName in Game.rooms){
        new RoomRunner(Game.rooms[roomName]).run();
    }
    for(let creepId in Game.creeps){
        let creep = <Creep>Game.getObjectById(creepId);
        new CreepRunner(creep).run();
    }
    cleanMemory();
}
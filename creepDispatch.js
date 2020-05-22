//Dispatches commands to given creep
//Will queue multiple simple commands if nessicary

var MCreepCommands = require('creepCommands');
var MCreepUtil = require('creepUtil');

const dispatch = {
    //Harvest until carry is filled
    harvestSource: function(creep, sourceId){
        MCreepUtil.queueCommand(creep, ["harvestSource", sourceId]);
    },
    //Harvest forever
    dropHarvestSource: function(creep, sourceId){
        MCreepUtil.queueCommand(creep, ["dropHarvestSource", sourceId]);
    },
    //Build something
    build: function(creep, siteId){
        MCreepUtil.queueCommand(creep, ["build", siteId]);
    },
    //Upgrade controller
    upgrade: function(creep){
        MCreepUtil.queueCommand(creep, ["upgrade"]);
    },
    //Repair something, optional max hitpoints to repair to
    repair: function(creep, hits=undefined){
        MCreepUtil.queueCommand(creep, ["repair", hits]);
    },
    //Withdraw resource from target
    withdraw: function(creep, sourceId, resourceType, amount=undefined){
        MCreepUtil.queueCommand(creep, ["withdraw", sourceId, resourceType, amount]);
    },
    //Pull target Creep
    pullMoveTo: function(creep, targetId, x, y, roomName=undefined){
        MCreepUtil.queueCommand(creep, ["pullMoveTo", targetId, x, y, roomName]);
    },
    //Pause until pull operation is compelte
    bePulledMoveTo: function(creep, targetId){
        MCreepUtil.queueCommand(creep, ["bePulledMoveTo", targetId]);
    },
    //Claim a room
    claim: function(creep, targetId){
        MCreepUtil.queueCommand(creep, ["claim", targetId]);
    },
    //Move to a position
    moveTo: function(creep, x, y, roomName=undefined){
        MCreepUtil.queueCommand(creep, ["moveTo", x, y, roomName]);
    },
    //Pickup droped resource
    pickup: function(creep, targetId){
        MCreepUtil.queueCommand(creep, ["pickup", targetId]);
    },
    //Transfer resource
    transfer: function(creep, targetId, resourceType, amount=undefined){
        MCreepUtil.queueCommand(creep, ["transfer", targetId, resourceType, amount]);
    },
    moveHarvestDeposit: function(creep, sourceId, resourceType=RESOURCE_ENERGY, depositId=undefined){
        let pos = Game.getObjectById(sourceId).pos;
        MCreepUtil.queueCommand(creep, ["moveTo", pos.x, pos.y, pos.roomName]);
        MCreepUtil.queueCommand(creep, ["harvestSource", sourceId]);
        if(depositId){
            pos = Game.getObjectById(depositId).pos;
            MCreepUtil.queueCommand(creep, ["moveTo", pos.x, pos.y, pos.roomName]);
            MCreepUtil.queueCommand(creep, ["transfer", depositId, resourceType]);
        }
    }
};

module.exports = dispatch;

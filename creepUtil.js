var MDispatch = require('dispatch');

const creepUtil = {
    bodyTypes: {
        GENERAL: 0, //1/2 move, 1/4 carry, 1/4 work
        MOVE: 1, //All move
        TRANSPORT: 2, //1/2 move, 1/2 carry
        WORK: 3, //2/3 work, 1/3 move
        WORK_ONLY: 4, //All work
        GENERAL_SLOW: 5, //1/3 move, 1/3 carry, 1/3 work
        TRANSPORT_SLOW: 6 //1/3 move, 2/3 carry
    },
    genericTypes: {
        GENERAL: 0,
        MOVE: 1,
        TRANSPORT: 2,
        WORK: 3
    },
    //Generates a creep body for the cost of the slected body type
    buildCreep: function(cost, bodyType){
        body = []
        switch(bodyType){
            case this.bodyTypes.GENERAL:
                while(cost > 0){
                    if(cost >= 50){
                        body.push["MOVE"];
                        cost -= 50;
                    }
                    if(cost >= 50){
                        body.push["CARRY"];
                        cost -= 50;
                    }
                    if(cost >= 50){
                        body.push["MOVE"];
                        cost -= 50;
                    }
                    if(cost > 100){
                        body.push["WORK"];
                        cost -= 100;
                    }
                }
            break;
            case this.bodyTypes.GENERAL_SLOW:
                while(cost > 0){
                    if(cost >= 50){
                        body.push["MOVE"];
                        cost -= 50;
                    }
                    if(cost >= 50){
                        body.push["CARRY"];
                        cost -= 50;
                    }
                    if(cost > 100){
                        body.push["WORK"];
                        cost -= 100;
                    }
                }
            break;
            case this.bodyTypes.MOVE:
                for(; cost > 0; cost -= 50){
                    body.push["MOVE"];
                }
            break;
            case this.bodyTypes.TRANSPORT:
                while(cost > 0){
                    if(cost >= 50){
                        body.push["MOVE"];
                        cost -= 50;
                    }
                    if(cost >= 50){
                        body.push["CARRY"];
                        cost -= 50;
                    }
                }
            break;
            case this.bodyTypes.TRANSPORT_SLOW:
                while(cost > 0){
                    if(cost >= 50){
                        body.push["MOVE"];
                        cost -= 50;
                    }
                    if(cost >= 50){
                        body.push["CARRY"];
                        cost -= 50;
                    }
                    if(cost >= 50){
                        body.push["CARRY"];
                        cost -= 50;
                    }
                }
            break;
            case this.bodyTypes.WORK:
                while(cost > 0){
                    if(cost >= 50){
                        body.push["MOVE"];
                        cost -= 50;
                    }
                    if(cost > 100){
                        body.push["WORK"];
                        cost -= 100;
                    }
                    if(cost > 100){
                        body.push["WORK"];
                        cost -= 100;
                    }
                }
            break;
            case this.bodyTypes.WORK_ONLY:
                for(; cost > 0; cost -= 100){
                    body.push["WORK"];
                }
            break;
            default:
                console.log("Invalid body type")
            break;
        }
        return body;
    },
    //Add a new command to the creep's command queue / run command
    queueCommand: function(creep, command){
        if(!creep.memory.commandQueue) {
            creep.memory.commandQueue = [];
            creep.memory.repeatCommands = false;
        }
        creep.memory.commandQueue.push(command);
        if(!creep.memory.currentCommand){
            this.nextCommand(creep);
        }
    },
    //Clear all of the creeps commands
    clearQueue: function(creep){
        creep.memory.commandQueue = [];
        creep.memory.currentCommand = null;
    },
    //Start the next command on the command queue, currentCommand is null if there is nothing to do
    nextCommand: function(creep){
        if(!creep.memory.commandQueue) {
            creep.memory.commandQueue = [];
            creep.memory.repeatCommands = false;
        }
        if(creep.memory.repeatCommands){
            creep.memory.commandQueue.push(creep.memory.currentCommand);
        }
        if(creep.memory.commandQueue.length > 0){
            creep.memory.currentCommand = creep.memory.commandQueue.shift();
            this.processCommand(creep);
        }else{
            creep.memory.currentCommand = null;
        }
    },
    //Process the creeps command queue
    processCommand: function(creep){
        if(creep.memory.currentCommand){
            if(MDispatch[creep.memory.currentCommand[0]](...creep.memory.currentCommand)){
                this.nextCommand(creep);
            }
        }
    }
};

module.exports = creepUtil;
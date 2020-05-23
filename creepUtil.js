
const creepUtil = {
    bodyTypes: {
        GENERAL: {
            //1/2 move, 1/4 carry, 1/4 work
            name: "GENERAL",
            minCost: 250,
            maxCost: 0,
            generic: "GENERAL",
            build: function(cost){
                body = [];
                while(cost > 0){
                    if(cost >= 50){
                        body.push(CARRY);
                        cost -= 50;
                    }
                    if(cost >= 50){
                        body.push(MOVE);
                        cost -= 50;
                    }
                    if(cost >= 50){
                        body.push(MOVE);
                        cost -= 50;
                    }
                    if(cost >= 100){
                        body.push(WORK);
                        cost -= 100;
                    }
                }
                return body;
            }
        }, 
        MOVE: {
            //All move
            name: MOVE,
            minCost: 50,
            maxCost: 0,
            generic: MOVE,
            build: function(cost){
                body = [];
                for(; cost > 0; cost -= 50){
                    body.push(MOVE);
                }
                return body;
            }
        }, 
        TRANSPORT: {
            //1/2 move, 1/2 carry
            name: "TRANSPORT",
            minCost: 100,
            maxCost: 0,
            generic: "TRANSPORT",
            build: function(cost){
                body = [];
                while(cost > 0){
                    if(cost >= 50){
                        body.push(MOVE);
                        cost -= 50;
                    }
                    if(cost >= 50){
                        body.push(CARRY);
                        cost -= 50;
                    }
                }
                return body;
            }
        }, 
        WORK: {
            //2/3 work, 1/3 move
            name: WORK,
            minCost: 250,
            maxCost: 750,
            generic: WORK,
            build: function(cost){
                body = [];
                while(cost > 0){
                    if(cost >= 50){
                        body.push(MOVE);
                        cost -= 50;
                    }
                    if(cost > 100){
                        body.push(WORK);
                        cost -= 100;
                    }
                    if(cost > 100){
                        body.push(WORK);
                        cost -= 100;
                    }
                }
                return body;
            }
        }, 
        WORK_ONLY: {
            //All work
            name: "WORK_ONLY",
            minCost: 100,
            maxCost: 600,
            generic: WORK,
            build: function(cost){
                body = [];
                for(; cost > 0; cost -= 100){
                    body.push(WORK);
                }
                return body;
            }
        }, 
        GENERAL_SLOW: {
            //1/3 move, 1/3 carry, 1/3 work
            name: "GENERAL_SLOW",
            minCost: 200,
            maxCost: 0,
            generic: "GENERAL",
            build: function(cost){
                body = [];
                while(cost > 0){
                    if(cost >= 50){
                        body.push(MOVE);
                        cost -= 50;
                    }
                    if(cost >= 50){
                        body.push(CARRY);
                        cost -= 50;
                    }
                    if(cost > 100){
                        body.push(WORK);
                        cost -= 100;
                    }
                }
                return body;
            }
        }, 
        TRANSPORT_SLOW: {
            //1/3 move, 2/3 carry
            name: "TRANSPORT_SLOW",
            minCost: 150,
            maxCost: 0,
            generic: "TRANSPORT",
            build: function(cost){
                body = [];
                while(cost > 0){
                    if(cost >= 50){
                        body.push(MOVE);
                        cost -= 50;
                    }
                    if(cost >= 50){
                        body.push(CARRY);
                        cost -= 50;
                    }
                    if(cost >= 50){
                        body.push(CARRY);
                        cost -= 50;
                    }
                }
                return body;
            }
        }, 
    }
};

module.exports = creepUtil;
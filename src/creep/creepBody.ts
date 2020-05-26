
export class CreepBody{
    body: BodyPartConstant[];
    maxCost: number;
    minCost: number;
    cost: number;
    name: string;
    constructor(cost: number, maxCost: number, minCost: number, name: string){
        this.cost = Math.min(Math.max(cost, minCost), maxCost);
        this.maxCost = maxCost;
        this.minCost = minCost;
        this.name = name;
        this.body = [];
    }
}

export class GeneralCreep extends CreepBody{
    constructor(cost: number){
        super(cost, 2500, 200, "GeneralCreep");
        for(let i = this.cost; i >= 0;){
            if(i >= 50){
                this.body.push(MOVE);
                i -= 50;
            }
            if(i >= 50){
                this.body.push(CARRY);
                i -= 50;
            }
            if(i >= 100){
                this.body.push(WORK);
                i -= 100;
            }
        }
    }
}

export class DropHarvestCreep extends CreepBody{
    constructor(cost: number){
        super(cost, 1700, 450, "DropHarvestCreep");
        for(let i = this.cost; i >= 0;){
            if(i >= 50){
                this.body.push(MOVE);
                i -= 50;
            }
            for(let j = 0; j < 4; ++j){
                if(i >= 100){
                    this.body.push(WORK);
                    i -= 100;
                }
            }
        }
    }
}

export class LinkHarvestCreep extends CreepBody{
    constructor(cost: number){
        super(cost, 1750, 400, "LinkHarvestCreep");
        let i = this.cost
        if(i >= 50){
            this.body.push(MOVE);
            i -= 50;
        }
        if(i >= 50){
            this.body.push(CARRY);
            i -= 50;
        }
        for(let j = 0; j < 3; ++j){
            if(i >= 100){
                this.body.push(WORK);
                i -= 100;
            }
        }
        for(; i >= 0;){
            if(i >= 50){
                this.body.push(MOVE);
                i -= 50;
            }
            for(let j = 0; j < 4; ++j){
                if(i >= 100){
                    this.body.push(WORK);
                    i -= 100;
                }
            }
        }
    }
}

export class FerryCreep extends CreepBody{
    constructor(cost: number){
        super(cost, 2500, 250, "FerryCreep");
        for(let i = this.cost; i >= 0;){
            if(i >= 50){
                this.body.push(MOVE);
                i -= 50;
            }
            for(let j = 0; j < 4; ++j){
                if(i >= 50){
                    this.body.push(CARRY);
                    i -= 50;
                }
            }
        }
    }
}

export class FastFerryCreep extends CreepBody{
    constructor(cost: number){
        super(cost, 2500, 150, "FastFerryCreep");
        for(let i = this.cost; i >= 0;){
            if(i >= 50){
                this.body.push(MOVE);
                i -= 50;
            }
            for(let j = 0; j < 2; ++j){
                if(i >= 50){
                    this.body.push(CARRY);
                    i -= 50;
                }
            }
        }
    }
}

export class ClaimCreep extends CreepBody{
    constructor(cost: number){
        super(cost, 650, 650, "ClaimCreep");
        this.body = [CLAIM, MOVE];
    }
}
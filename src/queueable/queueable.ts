
export interface QueueableConstructor{
    new (...args: any[]): Queueable;
}

export let registrare: {[name: string]: QueueableConstructor} = {};

export class Queueable{
    promiseId: number;
    repeating: boolean;
    args: object;
    name: string = "Queueable";
    constructor(args: object = {}, repeating: boolean = false, promiseId?: number){
        this.repeating = repeating;
        this.args = args;
        if(promiseId == undefined){
            this.promiseId = Memory.promiseCount;
            Memory.promiseCount = (Memory.promiseCount + 1) % 1000000000;
        }else{
            this.promiseId = promiseId;
        }
    }
    serialize(){
        return 
    }
    run(actor: object): boolean{
        return true;
    }
    validate(actor: object): boolean{
        return true;
    }
}

registrare["Queueable"] = Queueable;

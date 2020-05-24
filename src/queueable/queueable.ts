import { PromiseState } from "../utils";

export interface QueueableConstructor{
    new (...args: any[]): Queueable;
}

export let registrare: {[name: string]: QueueableConstructor} = {};

export class Queueable{
    promiseId: string;
    repeating: boolean;
    args: object;
    name: string = "Queueable";
    constructor(args: object = {}, repeating: boolean = false, promiseId?: string){
        this.repeating = repeating;
        this.args = args;
        if(promiseId === undefined){
            this.promiseId = Memory.promiseCount.toString();
            Memory.promiseCount = (Memory.promiseCount + 1) % 1000000000;
        }else{
            this.promiseId = promiseId;
        }
    }
    run(actor: object): boolean{
        this.end(PromiseState.SUCESS);
        return true;
    }
    validate(actor: object): boolean{
        return true;
    }
    start(){
        Memory.promises[this.promiseId] = {status: PromiseState.RUNNING, age: 0};
    }
    end(status: PromiseState, force = false){
        if(force || !this.repeating){
            Memory.promises[this.promiseId] = {status: status, age: Game.time};
        }
    }
}

registrare["Queueable"] = Queueable;

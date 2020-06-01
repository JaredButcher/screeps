
export enum PromiseState {RUNNING, SUCESS, ERR_DEAD, ERR_INVALID_ARGS, 
    ERR_INVALID_TARGET, ERR_LACK_RESOURCE, ERR_PREEMPTED, ERR_MISC_ERROR};

export const PROMISE_LIFE = 100;

export function fetchPromise(promiseId: string): PromiseState | null {
    let entry = Memory.promises[promiseId];
    if(entry){
        return entry.status;
    }else{
        return null;
    }
}

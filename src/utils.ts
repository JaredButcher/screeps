export const PROMISE_LIFE = 100;

export function fetchPromise(promiseId: string): PromiseState | null {
    let entry = Memory.promises[promiseId];
    if(entry){
        return entry.status;
    }else{
        return null;
    }
}


export function initDistrictMemory(districtMemory: DisctrictMemory) {
    districtMemory.inited = true;
    if(!districtMemory.name){
        districtMemory.name = Math.random().toString();
    }
    districtMemory.rooms = [];
    districtMemory.aPriority = [];
    districtMemory.aPromises = [];
    districtMemory.aQueue = [];
}
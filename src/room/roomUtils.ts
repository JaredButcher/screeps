import {isFlagOfType, flagTypes} from '../flags';


export function getConstructionSiteFlags(room: Room){
    return room.find(FIND_FLAGS, {filter: x => isFlagOfType(x, 'constructionSite')});
}
export function activateConstructionSite(room: Room, flag: Flag){
    room.createConstructionSite(flag.pos, (<ConstructionSiteFlagMemory>flag.memory).siteType);
    flag.remove();
}
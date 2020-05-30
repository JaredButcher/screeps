import {initMemory} from './manageMemory';

export function attach() {
    global.initMemory = initMemory
}
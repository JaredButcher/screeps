import {CreepTask, CreepTaskArgs, CreepManager} from './creepManager';
import {PromiseState} from '../utils';

export interface CreepTaskArgsEmpty extends CreepTaskArgs{
    targetIds?: Id<AnyStoreStructure>[];
    targetId?: Id<AnyStoreStructure>;
    sorted?: boolean;
    resourceType: ResourceConstant;
}

export class CreepTaskEmpty extends CreepTask{
    constructor(manager: CreepManager, args: CreepTaskArgsEmpty, repeating: boolean = false, priority: boolean = false, promiseId?: string, name: string = CreepTaskEmpty.name){
        args.range = 1;
        super(manager, args, name, repeating, priority, promiseId);
    }
    run(): boolean{
        let creep = <Creep>this.manager.actor;
        let args = <CreepTaskArgsEmpty>this.args;
        if(creep.store.getUsedCapacity(args.resourceType) == 0){
            this.end(PromiseState.SUCESS);
            return true;
        }
        if(super.run()){
            if(!args.targetId){
                if(!this.setTarget(creep)){
                    this.end(PromiseState.ERR_INVALID_TARGET);
                    return true;
                }else{
                    return false;
                }
            }else{
                let target: AnyStoreStructure = <AnyStoreStructure>Game.getObjectById(args.targetId);
                if(creep.transfer(target, args.resourceType) != OK){
                    args.targetId = undefined;
                }
                return false;
            }
        }
        return false;
    }
    setTarget(creep: Creep): boolean{
        let args = <CreepTaskArgsEmpty>this.args;
        let targets: AnyStoreStructure[] = [];
        let target: AnyStoreStructure;
        if(args.targetIds){
            targets = <AnyStoreStructure[]>args.targetIds.map((x) => Game.getObjectById(x));
        }else{
            targets = <AnyStoreStructure[]>creep.room.find(FIND_STRUCTURES, {filter: (x) => ('store' in x) && (!('my' in x) || x.my)});
            args.targetIds = targets.map((x) => x.id);
        }
        targets = targets.filter((x) => (<StoreDefinition>x.store).getFreeCapacity(args.resourceType) > 0);
        if(targets.length > 0){
            if(!args.sorted){
                target = <AnyStoreStructure>creep.pos.findClosestByRange(targets);
            }else{
                target = targets[0];
            }
            args.x = target.pos.x;
            args.y = target.pos.y;
            args.roomName = target.pos.roomName;
            args.targetId = target.id;
            return true;
        }else{
            return false;
        }
    }
}

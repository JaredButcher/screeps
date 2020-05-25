import {registrare, PromiseState} from '../runner/runner';
import {CreepRunner} from './creepRunner';
import {CreepTask, CreepTaskArgs} from './CreepTask';

export interface CreepTaskArgsFill extends CreepTaskArgs{
    targetIds?: Id<StorageStructure>[];
    targetId?: Id<StorageStructure>;
    sorted?: boolean;
    resourceType: ResourceConstant;
    amount?: number
}

type StorageStructure = Structure<STRUCTURE_CONTAINER> | Structure<STRUCTURE_STORAGE>;

export class CreepTaskFill extends CreepTask{
    constructor(args: CreepTaskArgsFill, repeating: boolean = false, promiseId?: string){
        args.range = 1;
        super(args, repeating, promiseId);
    }
    run(runner: CreepRunner): boolean{
        let creep = <Creep>runner.actor;
        let args = <CreepTaskArgsFill>this.args;
        if((args.amount && creep.store.getUsedCapacity(args.resourceType) >= args.amount) || creep.store.getFreeCapacity(args.resourceType) == 0){
            this.end(PromiseState.SUCESS);
            return true;
        }
        if(super.run(runner)){
            if(!args.targetId){
                if(!this.setTarget(creep)){
                    this.end(PromiseState.ERR_INVALID_TARGET);
                    return true;
                }else{
                    return false;
                }
            }else{
                let target: StorageStructure = <StorageStructure>Game.getObjectById(args.targetId);
                if(creep.withdraw(target, args.resourceType) != OK){
                    args.targetId = undefined;
                }
                return false;
            }
        }
        return false;
    }
    setTarget(creep: Creep): boolean{
        let args = <CreepTaskArgsFill>this.args;
        let targets: StorageStructure[] = [];
        let target: StorageStructure;
        if(args.targetIds){
            targets = <StorageStructure[]>args.targetIds.map((x) => Game.getObjectById(x));
        }else{
            targets = <StorageStructure[]>creep.room.find(FIND_STRUCTURES, {filter: (x) => (x.structureType == STRUCTURE_STORAGE && x.my) || x.structureType == STRUCTURE_CONTAINER});
            args.targetIds = targets.map((x) => x.id);
        }
        targets = targets.filter((x) => (<StoreDefinition>(<AnyStoreStructure>x).store).getUsedCapacity(args.resourceType) > 0);
        if(targets.length > 0){
            if(!args.sorted){
                target = <StorageStructure>creep.pos.findClosestByRange(targets);
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

registrare["CreepTaskFill"] = CreepTaskFill;
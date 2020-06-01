import {Queueable} from '../runner/runner';
import {RoomJobArgs, RoomJob} from './roomJob';
import {RoomJobBuild} from './roomJobBuild';
import {RoomJobBuild} from './roomJobBuild';
import {RoomJobBuild} from './roomJobBuild';
import {RoomJobBuild} from './roomJobBuild';
import {RoomJobBuild} from './roomJobBuild';
import {RoomJobBuild} from './roomJobBuild';
import {RoomJobBuild} from './roomJobBuild';

export function roomGetJob(runner: RoomRunner, job: RoomJob): RoomJob {
    switch(job.name){
        case RoomJobBuild.name:
            return new RoomJobBuild()
        break;
        case RoomJobBuild.name:
        break;
        case RoomJobBuild.name:
        break;
        case RoomJobBuild.name:
        break;
        case RoomJobBuild.name:
        break;
        case RoomJobBuild.name:
        break;
        case RoomJobBuild.name:
        break;
    }
}
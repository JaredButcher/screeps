import {Manager, Task} from './manager';

export class Runner{
    memory: ManagerMemory;
    actor: object;
    manager: Manager;
    constructor(actor: object, memory: ManagerMemory, manager: Manager){
        this.actor = actor;
        this.memory = memory;
        this.manager = manager;
    }
    run(){
        let tasksRan = 0;
        for(let taskMemory of this.memory.taskQueue){
            if(taskMemory.priority || tasksRan == 0){
                if(!taskMemory.priority) ++tasksRan;
                let currentTask: Task | null = this.getTask(taskMemory);
                if(currentTask){
                    let result = currentTask.run();
                    if(result){
                        if(currentTask.repeating){
                            this.manager.queue(currentTask);
                        }
                        this.manager.shift();
                    }
                }
            }
        }
    }
    getTask(task: TaskMemory): Task | null{
        return new Task(this.manager, task.args, Task.name, task.repeating, task.priority, task.promiseId);
    }
}

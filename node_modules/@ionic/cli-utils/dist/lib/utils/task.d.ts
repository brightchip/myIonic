import * as inquirerType from 'inquirer';
import ui = inquirerType.ui;
import { ITask, ITaskChain } from '../../definitions';
export declare class Task implements ITask {
    msg: string;
    bottomBar: ui.BottomBar;
    intervalId?: any;
    running: boolean;
    private spinner;
    private progressBar?;
    constructor(msg: string, bottomBar: ui.BottomBar);
    start(): this;
    tick(): this;
    progress(prog: number, total: number): this;
    format(): string;
    clear(): this;
    end(): this;
    succeed(): this;
    fail(): this;
}
export declare class TaskChain implements ITaskChain {
    bottomBar: ui.BottomBar;
    protected currentTask?: Task;
    tasks: ITask[];
    constructor(bottomBar: ui.BottomBar);
    next(msg: string): Task;
    updateMsg(msg: string): this;
    end(): this;
    fail(): this;
    cleanup(): this;
}

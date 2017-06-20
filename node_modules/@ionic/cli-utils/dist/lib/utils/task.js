"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tty = require("tty");
const chalk = require("chalk");
const format_1 = require("./format");
const modules_1 = require("../modules");
const FRAMES = process.platform === 'win32' ?
    ['-', '\\', '|', '/'] :
    ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
class Spinner {
    constructor(frames = FRAMES) {
        this.frames = frames;
        this.i = 0;
    }
    frame() {
        return this.frames[this.i = ++this.i % this.frames.length];
    }
}
class Task {
    constructor(msg, bottomBar) {
        this.msg = msg;
        this.bottomBar = bottomBar;
        this.running = false;
        this.spinner = new Spinner();
    }
    start() {
        if (!this.running) {
            this.intervalId = setInterval(() => { this.tick(); }, 50);
        }
        this.running = true;
        return this;
    }
    tick() {
        this.bottomBar.updateBottomBar(this.format());
        return this;
    }
    progress(prog, total) {
        if (this.running && process.platform !== 'win32') {
            if (!this.progressBar) {
                const term = tty;
                const ProgressBar = modules_1.load('progress');
                const s = new term.WriteStream();
                s.columns = s.columns || 80;
                this.progressBar = new ProgressBar('[:bar] :percent', {
                    total: total,
                    width: 30,
                    stream: s,
                });
            }
            const progbar = this.progressBar;
            progbar.curr = prog;
            if (prog < total) {
                this.progressBar.tick(0);
            }
            this.tick();
        }
        return this;
    }
    format() {
        const progbar = this.progressBar;
        const progress = progbar ? progbar.lastDraw.trim() : '';
        return `${chalk.bold(this.spinner.frame())} ${this.msg} ${progress}`;
    }
    clear() {
        clearInterval(this.intervalId);
        this.bottomBar.updateBottomBar('');
        return this;
    }
    end() {
        this.running = false;
        this.tick();
        this.clear();
        return this;
    }
    succeed() {
        if (this.running) {
            this.end();
            this.bottomBar.log.write(`${chalk.green(format_1.ICON_SUCCESS_GREEN)} ${this.msg} - done!`);
        }
        return this;
    }
    fail() {
        if (this.running) {
            this.end();
            this.bottomBar.log.write(`${chalk.red(format_1.ICON_FAILURE_RED)} ${this.msg} - failed!`);
        }
        return this;
    }
}
exports.Task = Task;
class TaskChain {
    constructor(bottomBar) {
        this.bottomBar = bottomBar;
        this.tasks = [];
    }
    next(msg) {
        if (this.currentTask) {
            this.currentTask.succeed();
        }
        const task = new Task(msg, this.bottomBar);
        this.tasks.push(task);
        this.currentTask = task;
        task.start();
        return task;
    }
    updateMsg(msg) {
        if (this.currentTask) {
            this.currentTask.msg = msg;
        }
        return this;
    }
    end() {
        if (this.currentTask) {
            this.currentTask.succeed();
            this.currentTask = undefined;
        }
        return this;
    }
    fail() {
        if (this.currentTask) {
            this.currentTask.fail();
        }
        return this;
    }
    cleanup() {
        for (let task of this.tasks) {
            if (task.running) {
                task.fail();
            }
            task.clear();
        }
        return this;
    }
}
exports.TaskChain = TaskChain;

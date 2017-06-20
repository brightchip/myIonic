"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modules_1 = require("../modules");
function runcmd(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        const crossSpawn = modules_1.load('cross-spawn');
        const p = crossSpawn.spawn(command, args, options);
        let stdoutBufs = [];
        let stderrBufs = [];
        let dualBufs = [];
        if (p.stdout) {
            p.stdout.on('data', (chunk) => {
                if (options.stdoutPipe) {
                    options.stdoutPipe.write(chunk);
                }
                else {
                    if (Buffer.isBuffer(chunk)) {
                        stdoutBufs.push(chunk);
                        dualBufs.push(chunk);
                    }
                    else {
                        stdoutBufs.push(Buffer.from(chunk));
                        dualBufs.push(Buffer.from(chunk));
                    }
                }
            });
        }
        if (p.stderr) {
            p.stderr.on('data', (chunk) => {
                if (options.stderrPipe) {
                    options.stderrPipe.write(chunk);
                }
                else {
                    if (Buffer.isBuffer(chunk)) {
                        stderrBufs.push(chunk);
                        dualBufs.push(chunk);
                    }
                    else {
                        stderrBufs.push(Buffer.from(chunk));
                        dualBufs.push(Buffer.from(chunk));
                    }
                }
            });
        }
        p.on('error', (err) => {
            reject(err);
        });
        p.on('close', (code) => {
            if (code === 0) {
                resolve(Buffer.concat(stdoutBufs).toString());
            }
            else {
                reject([code, Buffer.concat(dualBufs).toString()]);
            }
        });
    });
}
exports.runcmd = runcmd;

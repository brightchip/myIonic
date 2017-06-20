/// <reference types="node" />
import * as crossSpawnType from 'cross-spawn';
export interface RunCmdOptions extends crossSpawnType.SpawnOptions {
    stdoutPipe?: NodeJS.WritableStream;
    stderrPipe?: NodeJS.WritableStream;
}
export declare function runcmd(command: string, args?: string[], options?: RunCmdOptions): Promise<string>;

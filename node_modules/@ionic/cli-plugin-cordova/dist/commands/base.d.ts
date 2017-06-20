import { Command, CommandLineInputs, CommandLineOptions, CommandPreRun, IShellRunOptions } from '@ionic/cli-utils';
export declare class CordovaCommand extends Command {
    runCordova(argList: string[], {fatalOnNotFound, truncateErrorOutput, ...options}?: IShellRunOptions): Promise<string>;
}
export declare class CordovaPlatformCommand extends CordovaCommand implements CommandPreRun {
    preRun(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
}

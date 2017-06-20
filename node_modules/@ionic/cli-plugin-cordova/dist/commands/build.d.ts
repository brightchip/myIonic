import { CommandLineInputs, CommandLineOptions } from '@ionic/cli-utils';
import { CordovaPlatformCommand } from './base';
export declare class BuildCommand extends CordovaPlatformCommand {
    run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
}

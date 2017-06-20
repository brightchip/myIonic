import { CommandLineInputs, CommandLineOptions, CommandPreInputsPrompt } from '@ionic/cli-utils';
import { CordovaCommand } from './base';
export declare class PluginCommand extends CordovaCommand implements CommandPreInputsPrompt {
    preInputsPrompt(inputs: CommandLineInputs): Promise<void | number>;
    run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
}

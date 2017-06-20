import * as inquirerType from 'inquirer';
import { Opts as MinimistOpts } from 'minimist';
import { CommandData, CommandLineInput, CommandLineOptions, IonicEnvironment } from '../../definitions';
export interface NormalizedMinimistOpts extends MinimistOpts {
    string: string[];
    boolean: string[];
    alias: {
        [key: string]: string[];
    };
    default: {
        [key: string]: CommandLineInput;
    };
}
export declare function normalizeOptionAliases(metadata: CommandData, options: CommandLineOptions): CommandLineOptions;
export declare function minimistOptionsToArray(options: CommandLineOptions): string[];
export declare function metadataToMinimistOptions(metadata: CommandData): NormalizedMinimistOpts;
export declare function metadataToInquirerQuestions(metadata: CommandData): (inquirerType.Question | undefined)[];
export declare function validateInputs(argv: string[], metadata: CommandData): void;
export declare function collectInputs(env: IonicEnvironment, argv: string[], metadata: CommandData): Promise<void>;
export declare function filterOptionsByIntent(metadata: CommandData, options: CommandLineOptions, intentName?: string): CommandLineOptions;

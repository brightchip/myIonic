import { CommandData, IonicEnvironment, ICommand, INamespace } from '../definitions';
export declare function showHelp(env: IonicEnvironment, inputs: string[]): Promise<void>;
export declare function formatHelp(env: IonicEnvironment, cmdOrNamespace: ICommand | INamespace, inputs: string[]): string;
export declare function getFormattedHelpDetails(env: IonicEnvironment, ns: INamespace, inputs: string[]): string;
export declare function formatCommandHelp(cmdMetadata: CommandData): string;
export declare function getListOfCommandDetails(cmdMetadataList: CommandData[]): string[];

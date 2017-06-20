import { CommandData, CommandLineInputs, CommandLineOptions, ICommand, IonicEnvironment, ValidationError } from '../../definitions';
import { FatalException } from '../errors';
export declare class Command implements ICommand {
    env: IonicEnvironment;
    metadata: CommandData;
    run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void | number>;
    validate(inputs: CommandLineInputs): ValidationError[];
    execute(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
    exit(msg: string, code?: number): FatalException;
    getCleanInputsForTelemetry(inputs: CommandLineInputs, options: CommandLineOptions): string[];
}

import { Validator, Validators } from '../definitions';
export declare const validators: Validators;
export declare function combine(...validators: Validator[]): Validator;
export declare function contains(values: (string | undefined)[], {caseSensitive}: {
    caseSensitive?: boolean;
}): Validator;

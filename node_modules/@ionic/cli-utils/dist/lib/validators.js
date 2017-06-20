"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const string_1 = require("./utils/string");
exports.validators = {
    required(input, key) {
        if (!input) {
            if (key) {
                return `${chalk.bold(key)} must not be empty.`;
            }
            else {
                return 'Must not be empty.';
            }
        }
        return true;
    },
    email(input, key) {
        if (!string_1.isValidEmail(input)) {
            if (key) {
                return `${chalk.bold(key)} is an invalid email address.`;
            }
            else {
                return 'Invalid email address.';
            }
        }
        return true;
    },
    numeric(input, key) {
        if (isNaN(Number(input))) {
            if (key) {
                return `${chalk.bold(key)} must be numeric.`;
            }
            else {
                return 'Must be numeric.';
            }
        }
        return true;
    },
};
function combine(...validators) {
    return function (input) {
        for (let v of validators) {
            let o = v(input);
            if (o !== true) {
                return o;
            }
        }
        return true;
    };
}
exports.combine = combine;
function contains(values, { caseSensitive = true }) {
    if (!caseSensitive) {
        values = values.map(v => typeof v === 'string' ? v.toLowerCase() : v);
    }
    return function (input, key) {
        if (!caseSensitive && typeof input === 'string') {
            input = input.toLowerCase();
        }
        if (values.indexOf(input) === -1) {
            const strValues = values.filter((v) => typeof v === 'string');
            const mustBe = (strValues.length !== values.length ? 'unset or one of' : 'one of') + ': ' + strValues.map(v => chalk.green(v)).join(', ');
            if (key) {
                return `${chalk.bold(key)} must be ${mustBe} (not ${typeof input === 'undefined' ? 'unset' : chalk.green(input)})`;
            }
            else {
                return `Must be ${mustBe} (not ${typeof input === 'undefined' ? 'unset' : chalk.green(input)})`;
            }
        }
        return true;
    };
}
exports.contains = contains;

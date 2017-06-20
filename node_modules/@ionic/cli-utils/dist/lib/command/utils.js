"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("../validators");
const typeDefaults = new Map()
    .set(String, null)
    .set(Boolean, false);
function normalizeOptionAliases(metadata, options) {
    if (!metadata) {
        return options;
    }
    return Object.keys(options).reduce((results, optionName) => {
        const metadataOptionFound = (metadata.options || []).find((mdOption) => (mdOption.name === optionName || (mdOption.aliases || []).includes(optionName)));
        if (metadataOptionFound) {
            results[metadataOptionFound.name] = options[optionName];
        }
        else {
            results[optionName] = options[optionName];
        }
        return results;
    }, {});
}
exports.normalizeOptionAliases = normalizeOptionAliases;
function minimistOptionsToArray(options) {
    return (Object.keys(options || {})).reduce((results, optionName) => {
        const daObject = options[optionName];
        if (optionName === '_' || !daObject) {
            return results;
        }
        if (daObject === true) {
            return results.concat(`--${optionName}`);
        }
        if (typeof daObject === 'string') {
            return results.concat(`--${optionName}=${daObject}`);
        }
        if (Array.isArray(daObject)) {
            return results.concat(daObject.map((value) => (`--${optionName}=${value}`)));
        }
        return results;
    }, []);
}
exports.minimistOptionsToArray = minimistOptionsToArray;
function normalizeOption(option) {
    if (!option.type) {
        option.type = String;
    }
    if (!option.default) {
        option.default = typeDefaults.get(option.type);
    }
    if (!option.aliases) {
        option.aliases = [];
    }
    return option;
}
function metadataToMinimistOptions(metadata) {
    let options = {
        string: [],
        boolean: [],
        alias: {},
        default: {}
    };
    if (!metadata.options) {
        return options;
    }
    for (let option of metadata.options.map(o => normalizeOption(o))) {
        if (option.type === String) {
            options.string.push(option.name);
        }
        else if (option.type === Boolean) {
            options.boolean.push(option.name);
        }
        options.default[option.name] = option.default;
        options.alias[option.name] = option.aliases;
    }
    return options;
}
exports.metadataToMinimistOptions = metadataToMinimistOptions;
function metadataToInquirerQuestions(metadata) {
    const questions = [];
    if (!metadata.inputs) {
        return questions;
    }
    for (let input of metadata.inputs) {
        if (input.prompt) {
            let o = [];
            if (input.validators) {
                o.push({ validate: validators_1.combine(...input.validators) });
            }
            o.push(input.prompt);
            questions.push(Object.assign({ name: input.name, message: input.description }, ...o));
        }
        else {
            questions.push(undefined);
        }
    }
    return questions;
}
exports.metadataToInquirerQuestions = metadataToInquirerQuestions;
function validateInputs(argv, metadata) {
    if (!metadata.inputs) {
        return;
    }
    for (let i in metadata.inputs) {
        const input = metadata.inputs[i];
        const skip = new Set();
        const errors = [];
        if (input.prompt) {
            skip.add(validators_1.validators.required);
        }
        if (input.validators) {
            for (let validator of input.validators) {
                if (skip.has(validators_1.validators.required) && !argv[i]) {
                    continue;
                }
                if (!skip.has(validator)) {
                    let r = validator(argv[i], input.name);
                    if (r !== true) {
                        errors.push({
                            message: r.toString(),
                            inputName: input.name
                        });
                    }
                }
            }
            if (errors.length > 0) {
                throw errors;
            }
        }
    }
}
exports.validateInputs = validateInputs;
function collectInputs(env, argv, metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!metadata.inputs) {
            return;
        }
        let questionsToRemove = [];
        const questions = metadataToInquirerQuestions(metadata);
        const inputIndexByName = new Map(metadata.inputs.map((input, i) => [input.name, i]));
        if (questions) {
            for (let question of questions) {
                if (question) {
                    let i = inputIndexByName.get(question.name || '');
                    if (i !== undefined) {
                        let v = argv[i];
                        if (v !== undefined) {
                            questionsToRemove.push(i);
                        }
                    }
                }
            }
            for (let i of questionsToRemove.sort((a, b) => b - a)) {
                questions.splice(i, 1);
            }
            const inquirerQuestions = questions.filter(q => typeof q !== 'undefined');
            const answers = yield env.prompt(inquirerQuestions);
            Object.keys(answers).forEach(function (name) {
                let i = inputIndexByName.get(name);
                if (i !== undefined) {
                    argv[i] = answers[name];
                }
            });
        }
    });
}
exports.collectInputs = collectInputs;
function filterOptionsByIntent(metadata, options, intentName) {
    return Object.keys(options).reduce((allOptions, optionName) => {
        const metadataOptionFound = (metadata.options || []).find((mdOption) => (mdOption.name === optionName || (mdOption.aliases || []).includes(optionName)));
        if (metadataOptionFound) {
            if (intentName && metadataOptionFound.intent === intentName) {
                allOptions[optionName] = options[optionName];
            }
            else if (!intentName && !metadataOptionFound.intent) {
                allOptions[optionName] = options[optionName];
            }
        }
        return allOptions;
    }, {});
}
exports.filterOptionsByIntent = filterOptionsByIntent;

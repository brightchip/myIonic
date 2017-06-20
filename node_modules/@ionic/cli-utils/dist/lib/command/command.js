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
const guards_1 = require("../../guards");
const errors_1 = require("../errors");
const utils_1 = require("./utils");
class Command {
    run(inputs, options) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    validate(inputs) {
        try {
            utils_1.validateInputs(inputs, this.metadata);
        }
        catch (e) {
            if (guards_1.isValidationErrorArray(e)) {
                return e;
            }
            else {
                throw e;
            }
        }
        return [];
    }
    execute(inputs, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let r;
            if (guards_1.isCommandPreInputsPrompt(this)) {
                r = yield this.preInputsPrompt(inputs);
                if (typeof r === 'number') {
                    if (r > 0) {
                        throw this.exit('', r);
                    }
                    return;
                }
            }
            yield utils_1.collectInputs(this.env, inputs, this.metadata);
            if (guards_1.isCommandPreRun(this)) {
                r = yield this.preRun(inputs, options);
                if (typeof r === 'number') {
                    if (r > 0) {
                        throw this.exit('', r);
                    }
                    return;
                }
            }
            const results = yield Promise.all([
                (() => __awaiter(this, void 0, void 0, function* () {
                    const configData = yield this.env.config.load();
                    if (configData.cliFlags.enableTelemetry !== false) {
                        let cmdInputs = [];
                        if (this.metadata.name === 'help') {
                            cmdInputs = inputs;
                        }
                        else {
                            cmdInputs = this.getCleanInputsForTelemetry(inputs, options);
                        }
                        yield this.env.telemetry.sendCommand(`ionic ${this.metadata.fullName}`, cmdInputs);
                    }
                }))(),
                (() => __awaiter(this, void 0, void 0, function* () {
                    yield this.run(inputs, options);
                }))()
            ]);
            r = results[1];
            if (typeof r === 'number') {
                if (r > 0) {
                    throw this.exit('', r);
                }
                return;
            }
        });
    }
    exit(msg, code = 1) {
        return new errors_1.FatalException(msg, code);
    }
    getCleanInputsForTelemetry(inputs, options) {
        if (this.metadata.inputs) {
            const mdi = this.metadata.inputs;
            inputs = inputs
                .filter((input, i) => {
                return !mdi[i].private;
            });
        }
        if (this.metadata.options) {
            const mdo = this.metadata.options;
            options = Object.keys(options)
                .filter(optionName => {
                const metadataOptionFound = mdo.find((mdOption) => (mdOption.name === optionName || (mdOption.aliases || []).includes(optionName)));
                return metadataOptionFound ? !metadataOptionFound.private : true;
            })
                .reduce((allOptions, optionName) => {
                allOptions[optionName] = options[optionName];
                return allOptions;
            }, {});
        }
        let optionInputs = utils_1.minimistOptionsToArray(options);
        return inputs.concat(optionInputs);
    }
}
exports.Command = Command;

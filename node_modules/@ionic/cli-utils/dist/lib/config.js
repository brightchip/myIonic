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
const path = require("path");
const os = require("os");
const chalk = require("chalk");
const errors_1 = require("./errors");
const format_1 = require("./utils/format");
const fs_1 = require("./utils/fs");
const modules_1 = require("./modules");
class BaseConfig {
    constructor(directory, fileName) {
        this.fileName = fileName;
        if (directory) {
            this.directory = path.resolve(directory);
        }
        else {
            this.directory = '';
        }
        this.filePath = path.resolve(directory, fileName);
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.configFile) {
                let o;
                try {
                    o = yield fs_1.fsReadJsonFile(this.filePath);
                }
                catch (e) {
                    if (e === fs_1.ERROR_FILE_NOT_FOUND) {
                        o = {};
                    }
                    else {
                        throw e;
                    }
                }
                const lodash = modules_1.load('lodash');
                this.originalConfigFile = lodash.cloneDeep(o);
                o = yield this.provideDefaults(o);
                if (this.is(o)) {
                    this.configFile = o;
                }
                else {
                    throw new errors_1.FatalException(`The config file (${chalk.bold(format_1.prettyPath(this.filePath))}) has an unrecognized format.\n`
                        + `Try deleting the file.`);
                }
            }
            return this.configFile;
        });
    }
    save(configFile) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!configFile) {
                configFile = this.configFile;
            }
            if (configFile) {
                const lodash = modules_1.load('lodash');
                if (!lodash.isEqual(configFile, this.originalConfigFile)) {
                    const dirPath = path.dirname(this.filePath);
                    try {
                        let stats = yield fs_1.fsStat(dirPath);
                        if (!stats.isDirectory()) {
                            throw `${dirPath} must be a directory it is currently a file`;
                        }
                    }
                    catch (e) {
                        yield fs_1.fsMkdirp(dirPath);
                    }
                    yield fs_1.fsWriteJsonFile(this.filePath, configFile, { encoding: 'utf8' });
                    this.configFile = configFile;
                    this.originalConfigFile = lodash.cloneDeep(configFile);
                }
            }
        });
    }
}
exports.BaseConfig = BaseConfig;
exports.CONFIG_FILE = 'config.json';
exports.CONFIG_DIRECTORY = path.resolve(os.homedir(), '.ionic');
class Config extends BaseConfig {
    provideDefaults(o) {
        return __awaiter(this, void 0, void 0, function* () {
            const lodash = modules_1.load('lodash');
            const results = lodash.cloneDeep(o);
            if (!results.lastCommand) {
                results.lastCommand = new Date().toISOString();
            }
            if (!results.urls) {
                results.urls = {};
            }
            if (!results.urls.api) {
                results.urls.api = 'https://api.ionic.io';
            }
            if (!results.urls.dash) {
                results.urls.dash = 'https://apps.ionic.io';
            }
            if (!results.tokens) {
                results.tokens = {};
            }
            if (!results.tokens.appUser) {
                results.tokens.appUser = {};
            }
            if (!results.cliFlags) {
                results.cliFlags = {};
            }
            if (typeof results.cliFlags.enableTelemetry === 'undefined') {
                results.cliFlags.enableTelemetry = true;
            }
            delete results.lastUpdated;
            delete results.cliFlags.promptedForTelemetry;
            return results;
        });
    }
    is(j) {
        return j
            && typeof j.lastCommand === 'string'
            && typeof j.urls === 'object'
            && typeof j.urls.api === 'string'
            && typeof j.urls.dash === 'string'
            && typeof j.tokens === 'object'
            && typeof j.tokens.appUser === 'object'
            && typeof j.cliFlags === 'object';
    }
}
exports.Config = Config;

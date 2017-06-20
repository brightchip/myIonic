"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const setup_1 = require("../lib/utils/setup");
class CordovaCommand extends cli_utils_1.Command {
    runCordova(argList, _a = {}) {
        var { fatalOnNotFound = false, truncateErrorOutput = 5000 } = _a, options = __rest(_a, ["fatalOnNotFound", "truncateErrorOutput"]);
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.env.shell.run('cordova', argList, Object.assign({ fatalOnNotFound, truncateErrorOutput }, options));
            }
            catch (e) {
                if (e === cli_utils_1.ERROR_SHELL_COMMAND_NOT_FOUND) {
                    throw this.exit(`The Cordova CLI was not found on your PATH. Please install Cordova globally:\n\n` +
                        `${chalk.green('npm install -g cordova')}\n`);
                }
                this.env.log.nl();
                this.env.log.error('Cordova encountered an error.\nYou may get more insight by running the Cordova command above directly.\n');
                throw e;
            }
        });
    }
}
exports.CordovaCommand = CordovaCommand;
class CordovaPlatformCommand extends CordovaCommand {
    preRun(inputs, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const [runPlatform] = inputs;
            if (runPlatform) {
                const [platforms, plugins] = yield Promise.all([
                    setup_1.getProjectPlatforms(this.env.project.directory),
                    setup_1.getProjectPlugins(this.env.project.directory),
                ]);
                if (!platforms.includes(runPlatform)) {
                    yield setup_1.installPlatform(this.env, runPlatform);
                }
                if (plugins.length === 0) {
                    yield setup_1.installPlugins(this.env);
                }
            }
        });
    }
}
exports.CordovaPlatformCommand = CordovaPlatformCommand;

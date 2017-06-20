"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const cordova_1 = require("../lib/utils/cordova");
const setup_1 = require("../lib/utils/setup");
const configXmlUtils_1 = require("../lib/utils/configXmlUtils");
const base_1 = require("./base");
let PrepareCommand = class PrepareCommand extends base_1.CordovaCommand {
    preRun(inputs, options) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    run(inputs, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const [platform] = inputs;
            yield configXmlUtils_1.resetConfigXmlContentSrc(this.env.project.directory);
            let platforms = yield setup_1.getProjectPlatforms(this.env.project.directory);
            this.env.log.debug(`platforms=${platforms}`);
            if (platform && !platforms.includes(platform)) {
                const promptResults = yield this.env.prompt({
                    message: `Platform ${chalk.green(platform)} is not installed! Would you like to install it?`,
                    type: 'confirm',
                    name: 'install',
                });
                if (promptResults['install']) {
                    yield setup_1.installPlatform(this.env, platform);
                    platforms = yield setup_1.getProjectPlatforms(this.env.project.directory);
                }
                else {
                    throw this.exit(`Platform ${chalk.green(platform)} not installed.`);
                }
            }
            if (!platforms.includes('android') && !platforms.includes('ios')) {
                const promptResults = yield this.env.prompt({
                    message: `You have no Cordova platforms added! Which platform would you like to install (${chalk.green('ios')}, ${chalk.green('android')}):`,
                    type: 'input',
                    name: 'platform',
                });
                yield setup_1.installPlatform(this.env, promptResults['platform']);
            }
            yield this.runCordova(cordova_1.gatherArgumentsForCordova(this.metadata, inputs, options));
        });
    }
};
PrepareCommand = __decorate([
    cli_utils_1.CommandMetadata({
        name: 'prepare',
        type: 'project',
        description: 'Transform metadata to platform manifests and copies assets to Cordova platforms',
        inputs: [
            {
                name: 'platform',
                description: `The platform you would like to prepare (e.g. ${chalk.green('ios')}, ${chalk.green('android')})`,
            },
        ]
    })
], PrepareCommand);
exports.PrepareCommand = PrepareCommand;

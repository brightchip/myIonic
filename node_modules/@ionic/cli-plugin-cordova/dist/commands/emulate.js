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
const configXmlUtils_1 = require("../lib/utils/configXmlUtils");
const cordova_1 = require("../lib/utils/cordova");
const base_1 = require("./base");
let EmulateCommand = class EmulateCommand extends base_1.CordovaPlatformCommand {
    run(inputs, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = cli_utils_1.normalizeOptionAliases(this.metadata, options);
            const isLiveReload = options['livereload'];
            if (!isLiveReload) {
                yield configXmlUtils_1.resetConfigXmlContentSrc(this.env.project.directory);
                yield this.env.hooks.fire('command:build', {
                    env: this.env,
                    inputs,
                    options: cordova_1.generateBuildOptions(this.metadata, options)
                });
            }
            else {
                const [serverSettings] = yield this.env.hooks.fire('command:serve', {
                    env: this.env,
                    inputs,
                    options: cordova_1.generateBuildOptions(this.metadata, options),
                });
                yield configXmlUtils_1.writeConfigXmlContentSrc(this.env.project.directory, `http://${serverSettings.publicIp}:${serverSettings.httpPort}`);
            }
            yield this.runCordova(cordova_1.filterArgumentsForCordova(this.metadata, inputs, options), { showExecution: true });
        });
    }
};
EmulateCommand = __decorate([
    cli_utils_1.CommandMetadata({
        name: 'emulate',
        type: 'project',
        description: 'Emulate an Ionic project on a simulator or emulator',
        exampleCommands: ['ios --livereload -c -s'],
        inputs: [
            {
                name: 'platform',
                description: `The platform to emulate: ${chalk.green('ios')}, ${chalk.green('android')}`,
                validators: [cli_utils_1.validators.required],
                prompt: {
                    message: `What platform would you like to emulate (${chalk.green('ios')}, ${chalk.green('android')}):`
                }
            }
        ],
        options: [
            {
                name: 'livereload',
                description: 'Live reload app dev files from the device',
                type: Boolean,
                aliases: ['l']
            },
            {
                name: 'address',
                description: 'Use specific address (livereload req.)',
                default: '0.0.0.0'
            },
            {
                name: 'consolelogs',
                description: 'Print app console logs to Ionic CLI',
                type: Boolean,
                aliases: ['c']
            },
            {
                name: 'serverlogs',
                description: 'Print dev server logs to Ionic CLI',
                type: Boolean,
                aliases: ['s']
            },
            {
                name: 'port',
                description: 'Dev server HTTP port',
                default: '8100',
                aliases: ['p']
            },
            {
                name: 'livereload-port',
                description: 'Live Reload port',
                default: '35729',
                aliases: ['r']
            },
            {
                name: 'prod',
                description: 'Create a prod build with app-scripts',
                type: Boolean
            },
            {
                name: 'list',
                description: 'List all available Cordova run targets',
                type: Boolean,
                intent: cordova_1.CORDOVA_INTENT
            },
            {
                name: 'debug',
                description: 'Create a Cordova debug build',
                type: Boolean,
                intent: cordova_1.CORDOVA_INTENT
            },
            {
                name: 'release',
                description: 'Create a Cordova release build',
                type: Boolean,
                intent: cordova_1.CORDOVA_INTENT
            },
            {
                name: 'device',
                description: 'Deploy Cordova build to a device',
                type: Boolean,
                intent: cordova_1.CORDOVA_INTENT
            },
            {
                name: 'target',
                description: `Deploy Cordova build to a device (use ${chalk.green('--list')} to see all)`,
                type: String,
                intent: cordova_1.CORDOVA_INTENT
            }
        ]
    })
], EmulateCommand);
exports.EmulateCommand = EmulateCommand;

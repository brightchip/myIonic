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
const configXmlUtils_1 = require("../lib/utils/configXmlUtils");
const base_1 = require("./base");
let PluginCommand = class PluginCommand extends base_1.CordovaCommand {
    preInputsPrompt(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            inputs[0] = (typeof inputs[0] === 'undefined') ? 'list' : inputs[0];
            inputs[0] = (inputs[0] === 'rm') ? 'remove' : inputs[0];
            inputs[0] = (inputs[0] === 'ls') ? 'list' : inputs[0];
            if (['list', 'save'].includes(inputs[0])) {
                const response = yield this.runCordova(['plugin', inputs[0]]);
                this.env.log.msg(response);
                return 0;
            }
        });
    }
    run(inputs, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let [action, pluginName] = inputs;
            if (!pluginName) {
                const promptResults = yield this.env.prompt({
                    message: `What plugin would you like to ${action}:`,
                    type: 'input',
                    name: 'plugin',
                });
                inputs[1] = pluginName = promptResults['plugin'];
            }
            yield configXmlUtils_1.resetConfigXmlContentSrc(this.env.project.directory);
            const normalizedOptions = cli_utils_1.normalizeOptionAliases(this.metadata, options);
            const optionList = cordova_1.gatherArgumentsForCordova(this.metadata, inputs, normalizedOptions);
            if (!optionList.includes('--save')) {
                optionList.push('--save');
            }
            const response = yield this.runCordova(optionList);
            this.env.log.msg(response);
        });
    }
};
PluginCommand = __decorate([
    cli_utils_1.CommandMetadata({
        name: 'plugin',
        type: 'project',
        description: 'Manage Cordova plugins',
        exampleCommands: ['add cordova-plugin-inappbrowser@latest', 'list'],
        inputs: [
            {
                name: 'action',
                description: `${chalk.green('add')} or ${chalk.green('remove')} a plugin; ${chalk.green('list')} or ${chalk.green('save')} all project plugins`,
            },
            {
                name: 'plugin',
                description: `The name of the plugin (corresponds to ${chalk.green('add')} and ${chalk.green('remove')})`,
            }
        ],
        options: [
            {
                name: 'force',
                description: `Forve overwrite the plugin if it exists (corresponds to ${chalk.green('add')})`,
                type: Boolean,
                default: false
            }
        ]
    })
], PluginCommand);
exports.PluginCommand = PluginCommand;

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
const chalk = require("chalk");
const stringWidth = require("string-width");
const guards_1 = require("../guards");
const validators_1 = require("./validators");
const format_1 = require("./utils/format");
const HELP_DOTS_WIDTH = 20;
function showHelp(env, inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        if (inputs.length === 0) {
            return env.log.msg(getFormattedHelpDetails(env, env.namespace, inputs));
        }
        let [slicedInputs, cmdOrNamespace] = env.namespace.locate(inputs);
        if (!guards_1.isCommand(cmdOrNamespace)) {
            let extra = '';
            if (!env.project.directory) {
                extra = '\nYou may need to be in an Ionic project directory.';
            }
            if (slicedInputs.length > 0) {
                env.log.error(`Unable to find command: ${chalk.green(inputs.join(' '))}${extra}\n`);
            }
        }
        env.log.msg(formatHelp(env, cmdOrNamespace, inputs));
    });
}
exports.showHelp = showHelp;
function formatHelp(env, cmdOrNamespace, inputs) {
    if (!guards_1.isCommand(cmdOrNamespace)) {
        return getFormattedHelpDetails(env, cmdOrNamespace, inputs);
    }
    const command = cmdOrNamespace;
    return formatCommandHelp(command.metadata);
}
exports.formatHelp = formatHelp;
function getFormattedHelpDetails(env, ns, inputs) {
    const globalMetadata = ns.getCommandMetadataList();
    const formatList = (details) => details.map(hd => `    ${hd}\n`).join('');
    if (ns.root) {
        const options = [
            ['--verbose', 'Verbose output for debugging'],
            ['--help', 'Show help for provided command'],
        ];
        const globalCommandDetails = getHelpDetails(env, globalMetadata, [(cmd) => cmd.type === 'global']);
        const projectCommandDetails = getHelpDetails(env, globalMetadata, [(cmd) => cmd.type === 'project']);
        const fillStrings = format_1.generateFillSpaceStringList(options.map(v => v[0]), HELP_DOTS_WIDTH, chalk.dim('.'));
        const optionDetails = options.map((opt, i) => chalk.green(opt[0]) + ' ' + fillStrings[i] + ' ' + opt[1]);
        return `${formatHeader(env)}\n\n` +
            `  ${chalk.bold('Usage')}:\n\n` +
            `    ${chalk.dim('$')} ${chalk.green('ionic <command> [arguments] [options]')}\n` +
            `    ${chalk.dim('$')} ${chalk.green('ionic <command> --help')} (for command details)\n\n` +
            `  ${chalk.bold('Global Commands')}:\n\n` +
            `${formatList(globalCommandDetails)}\n` +
            `  ${chalk.bold('Project Commands')}:\n\n` +
            `${env.project.directory ? formatList(projectCommandDetails) : '    You are not in a project directory.\n'}\n` +
            `  ${chalk.bold('Options')}:\n\n` +
            `${formatList(optionDetails)}\n`;
    }
    else {
        const commandDetails = getHelpDetails(env, globalMetadata, []);
        return `\n  ${chalk.bold('Commands')}:\n\n` +
            `${formatList(commandDetails)}\n`;
    }
}
exports.getFormattedHelpDetails = getFormattedHelpDetails;
function formatHeader(env) {
    return `   _             _
  (_)           (_)
   _  ___  _ __  _  ___
  | |/ _ \\| '_ \\| |/ __|
  | | (_) | | | | | (__
  |_|\\___/|_| |_|_|\\___|  CLI ${env.plugins.ionic.version}\n`;
}
function getHelpDetails(env, commandMetadataList, filters = []) {
    for (let f of filters) {
        commandMetadataList = commandMetadataList.filter(f);
    }
    const foundCommandList = commandMetadataList.filter((cmd) => typeof cmd.visible === 'undefined' ? true : cmd.visible);
    return getListOfCommandDetails(foundCommandList);
}
function formatCommandHelp(cmdMetadata) {
    if (!cmdMetadata.fullName) {
        cmdMetadata.fullName = cmdMetadata.name;
    }
    return `
  ${chalk.bold(cmdMetadata.description)}
  ` +
        formatCommandUsage(cmdMetadata.inputs, cmdMetadata.fullName) +
        formatCommandInputs(cmdMetadata.inputs) +
        formatCommandOptions(cmdMetadata.options) +
        formatCommandExamples(cmdMetadata.exampleCommands, cmdMetadata.fullName);
}
exports.formatCommandHelp = formatCommandHelp;
function getListOfCommandDetails(cmdMetadataList) {
    const fillStringArray = format_1.generateFillSpaceStringList(cmdMetadataList.map(cmdMd => cmdMd.fullName || cmdMd.name), HELP_DOTS_WIDTH, chalk.dim('.'));
    return cmdMetadataList.map((cmdMd, index) => `${chalk.green(cmdMd.fullName || '')} ` +
        `${fillStringArray[index]} ` +
        `${cmdMd.description}` +
        `${cmdMd.aliases && cmdMd.aliases.length > 0 ? ' (alias' + (cmdMd.aliases.length === 1 ? '' : 'es') + ': ' + cmdMd.aliases.map((a) => chalk.green(a)).join(', ') + ')' : ''}`);
}
exports.getListOfCommandDetails = getListOfCommandDetails;
function formatCommandUsage(inputs = [], commandName) {
    const formatInput = (input) => {
        if (input.validators && (input.validators.includes(validators_1.validators.required) && !input.prompt)) {
            return '<' + input.name + '>';
        }
        return '[' + input.name + ']';
    };
    const usageLine = `$ ${chalk.green('ionic ' + commandName + ' ' + inputs.map(formatInput).join(' '))}`;
    return `
  ${chalk.bold('Usage')}:
    ${usageLine}
  `;
}
function formatCommandInputs(inputs = []) {
    if (inputs.length === 0) {
        return '';
    }
    const fillStrings = format_1.generateFillSpaceStringList(inputs.map(input => input.name), 25, chalk.dim('.'));
    function inputLineFn({ name, description }, index) {
        const optionList = chalk.green(`${name}`);
        return `${optionList} ${fillStrings[index]} ${description}`;
    }
    ;
    return `
  ${chalk.bold('Inputs')}:
    ${inputs.map(inputLineFn).join(`
    `)}
  `;
}
function formatCommandOptions(options = []) {
    if (options.length === 0) {
        return '';
    }
    function optionLineFn(opt) {
        const optionList = chalk.green(`-${opt.name.length > 1 ? '-' : ''}${opt.name}`) +
            (opt.aliases && opt.aliases.length > 0 ? ', ' +
                opt.aliases
                    .map((alias) => chalk.green(`-${alias}`))
                    .join(', ') : '');
        const optionListLength = stringWidth(optionList);
        const fullLength = optionListLength > 25 ? optionListLength + 1 : 25;
        return `${optionList} ${Array(fullLength - optionListLength).fill(chalk.dim('.')).join('')} ${opt.description}${typeof opt.default === 'string' ? ' (default: ' + chalk.green(opt.default) + ')' : ''}`;
    }
    ;
    return `
  ${chalk.bold('Options')}:
    ${options.map(optionLineFn).join(`
    `)}
  `;
}
function formatCommandExamples(exampleCommands, commandName) {
    if (!Array.isArray(exampleCommands)) {
        return '';
    }
    const exampleLines = exampleCommands.map(cmd => `$ ionic ${commandName} ${cmd} `);
    return `
  ${chalk.bold('Examples')}:
    ${exampleLines.join(`
    `)}
  `;
}

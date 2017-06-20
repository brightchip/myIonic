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
const chalk = require("chalk");
const project_1 = require("./project");
const modules_1 = require("./modules");
const fs_1 = require("./utils/fs");
const http_1 = require("./http");
const npm_1 = require("./utils/npm");
exports.KNOWN_PLUGINS = ['cordova', 'proxy', 'ionic1', 'ionic-angular'];
exports.ORG_PREFIX = '@ionic';
exports.PLUGIN_PREFIX = 'cli-plugin-';
exports.ERROR_PLUGIN_NOT_INSTALLED = 'PLUGIN_NOT_INSTALLED';
exports.ERROR_PLUGIN_NOT_FOUND = 'PLUGIN_NOT_FOUND';
exports.ERROR_PLUGIN_INVALID = 'PLUGIN_INVALID';
function formatFullPluginName(name) {
    return `${exports.ORG_PREFIX}/${exports.PLUGIN_PREFIX}${name}`;
}
exports.formatFullPluginName = formatFullPluginName;
function promptToInstallProjectPlugin(env, { message }) {
    return __awaiter(this, void 0, void 0, function* () {
        const project = yield env.project.load();
        const projectPlugin = formatFullPluginName(project.type);
        if (!message) {
            message = `Looks like this is an ${project_1.PROJECT_TYPES_PRETTY.get(project.type)} project, would you like to install ${chalk.green(projectPlugin)} and continue?`;
        }
        return yield promptToInstallPlugin(env, projectPlugin, { message });
    });
}
exports.promptToInstallProjectPlugin = promptToInstallProjectPlugin;
function promptToInstallPlugin(env, pluginName, { message, reinstall = false }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!env.project.directory) {
            return;
        }
        try {
            return yield loadPlugin(env, pluginName, {
                askToInstall: true,
                reinstall,
                message,
            });
        }
        catch (e) {
            if (e !== exports.ERROR_PLUGIN_NOT_INSTALLED) {
                throw e;
            }
        }
    });
}
exports.promptToInstallPlugin = promptToInstallPlugin;
function installPlugin(env, plugin) {
    const ns = plugin.namespace;
    if (ns) {
        env.namespace.namespaces.set(ns.name, () => ns);
    }
    if (plugin.registerHooks) {
        plugin.registerHooks(env.hooks);
    }
    env.plugins[plugin.name] = plugin;
}
exports.installPlugin = installPlugin;
function uninstallPlugin(env, plugin) {
    if (plugin.namespace) {
        env.namespace.namespaces.delete(plugin.namespace.name);
    }
    env.hooks.deleteSource(plugin.name);
    delete env.plugins[plugin.name];
}
exports.uninstallPlugin = uninstallPlugin;
function loadPlugins(env) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!env.project.directory) {
            return () => __awaiter(this, void 0, void 0, function* () { });
        }
        const mPath = path.join(env.project.directory, 'node_modules', '@ionic');
        const ionicModules = yield fs_1.readDir(mPath);
        const pluginPkgs = ionicModules
            .filter(pkgName => pkgName.indexOf(exports.PLUGIN_PREFIX) === 0)
            .map(pkgName => `${exports.ORG_PREFIX}/${pkgName}`);
        const plugins = yield Promise.all(pluginPkgs.map(pkgName => {
            return loadPlugin(env, pkgName, { askToInstall: false });
        }));
        const project = yield env.project.load();
        const projectPlugin = formatFullPluginName(project.type);
        if (!pluginPkgs.includes(projectPlugin)) {
            const plugin = yield promptToInstallProjectPlugin(env, {});
            if (plugin) {
                plugins.push(plugin);
            }
        }
        const proxyPluginPkg = formatFullPluginName('proxy');
        const [, proxyVar] = http_1.getGlobalProxy();
        if (proxyVar && !pluginPkgs.includes(proxyPluginPkg)) {
            const plugin = yield promptToInstallPlugin(env, proxyPluginPkg, {
                message: `Detected '${chalk.green(proxyVar)}' in environment, but to proxy CLI requests, you'll need ${chalk.green(proxyPluginPkg)}. Would you like to install it and continue?`,
            });
            if (plugin) {
                plugins.push(plugin);
            }
        }
        for (let plugin of plugins) {
            installPlugin(env, plugin);
        }
    });
}
exports.loadPlugins = loadPlugins;
function loadPlugin(env, pluginName, { message, askToInstall = true, reinstall = false }) {
    return __awaiter(this, void 0, void 0, function* () {
        let m;
        if (!message) {
            message = `The plugin ${chalk.green(pluginName)} is not installed. Would you like to install it and continue?`;
        }
        try {
            const mPath = require.resolve(path.join(env.project.directory, 'node_modules', ...pluginName.split('/')));
            delete require.cache[mPath];
            m = require(mPath);
        }
        catch (e) {
            if (e.code !== 'MODULE_NOT_FOUND') {
                throw e;
            }
            let foundPackageNeeded = exports.KNOWN_PLUGINS.map(kp => formatFullPluginName(kp))
                .find(kp => e.message && e.message.includes(kp));
            if (!foundPackageNeeded) {
                throw `Dependency missing for ${chalk.bold(pluginName)}:\n\n  ${chalk.red('[ERROR]')}: ${e.message}`;
            }
        }
        if (!m && !askToInstall) {
            throw exports.ERROR_PLUGIN_NOT_INSTALLED;
        }
        if (!m || reinstall) {
            const answers = yield env.prompt([{
                    type: 'confirm',
                    name: 'installPlugin',
                    message,
                }]);
            if (answers['installPlugin']) {
                yield pkgInstallPlugin(env, pluginName);
                return loadPlugin(env, pluginName, { askToInstall });
            }
            else {
                throw exports.ERROR_PLUGIN_NOT_INSTALLED;
            }
        }
        return m;
    });
}
exports.loadPlugin = loadPlugin;
function checkForUpdates(env) {
    return __awaiter(this, void 0, void 0, function* () {
        const updates = [];
        let warnonly = false;
        const semver = modules_1.load('semver');
        const ionicLatestVersion = yield getLatestPluginVersion(env, env.plugins.ionic);
        const ionicDistTag = getReleaseChannelName(env.plugins.ionic.version);
        if (semver.gt(ionicLatestVersion, env.plugins.ionic.version)) {
            env.log.warn(`The Ionic CLI has an update available! Please upgrade (you might need ${chalk.green('sudo')}):\n\n    ${chalk.green('npm install -g ionic@' + ionicDistTag)}\n\n`);
            warnonly = true;
            updates.push(env.plugins.ionic.name);
        }
        for (let pluginName in env.plugins) {
            if (pluginName !== 'ionic') {
                const plugin = env.plugins[pluginName];
                const distTag = getReleaseChannelName(plugin.version);
                if (ionicDistTag === distTag) {
                    const latestVersion = yield getLatestPluginVersion(env, plugin);
                    if (semver.gt(latestVersion, plugin.version) || (ionicDistTag === 'canary' && latestVersion !== plugin.version)) {
                        updates.push(pluginName);
                        if (warnonly) {
                            env.log.warn(`Locally installed CLI Plugin ${chalk.green(plugin.name + '@' + chalk.bold(plugin.version))} has an update available (${chalk.green.bold(latestVersion)})! Please upgrade:\n\n    ${chalk.green('npm install --save-dev ' + plugin.name + '@' + distTag)}\n\n`);
                        }
                        else {
                            const p = yield promptToInstallPlugin(env, plugin.name, {
                                message: `Locally installed CLI Plugin ${chalk.green(plugin.name + '@' + chalk.bold(plugin.version))} has an update available (${chalk.green.bold(latestVersion)})! Would you like to install it and continue?`,
                                reinstall: true,
                            });
                            if (p) {
                                uninstallPlugin(env, plugin);
                                installPlugin(env, p);
                            }
                        }
                    }
                }
                else {
                    env.log.warn(`Locally installed CLI Plugin ${chalk.green(plugin.name + chalk.bold('@' + distTag))} has a different distribution tag than the Ionic CLI (${chalk.green.bold('@' + ionicDistTag)}).\n` +
                        `Please install the matching plugin version:\n\n    ${chalk.green('npm install --save-dev ' + plugin.name + '@' + ionicDistTag)}\n\n`);
                    updates.push(pluginName);
                }
            }
        }
        return updates;
    });
}
exports.checkForUpdates = checkForUpdates;
function getLatestPluginVersion(env, plugin) {
    return __awaiter(this, void 0, void 0, function* () {
        const distTag = getReleaseChannelName(plugin.version);
        if (distTag === 'local') {
            return plugin.version;
        }
        env.log.debug(`Checking for latest plugin version of ${chalk.bold(plugin.name + '@' + distTag)}.`);
        const cmdResult = yield env.shell.run('npm', ['view', plugin.name, `dist-tags.${distTag}`, '--json'], { showCommand: false });
        env.log.debug(`Latest version of ${chalk.bold(plugin.name + '@' + distTag)} is ${cmdResult}.`);
        const latestVersion = JSON.parse(cmdResult);
        if (!latestVersion) {
            return plugin.version;
        }
        return latestVersion.trim();
    });
}
exports.getLatestPluginVersion = getLatestPluginVersion;
function pkgInstallPlugin(env, name, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const releaseChannelName = getReleaseChannelName(env.plugins.ionic.version);
        let pluginInstallVersion = `${name}@${releaseChannelName}`;
        if (releaseChannelName === 'local') {
            options.link = true;
            pluginInstallVersion = name;
        }
        yield npm_1.pkgInstall(env, pluginInstallVersion, options);
    });
}
exports.pkgInstallPlugin = pkgInstallPlugin;
function getReleaseChannelName(version) {
    if (version.includes('-local')) {
        return 'local';
    }
    if (version.includes('-alpha')) {
        return 'canary';
    }
    if (version.includes('-beta') || version.includes('-rc')) {
        return 'beta';
    }
    return 'latest';
}
exports.getReleaseChannelName = getReleaseChannelName;

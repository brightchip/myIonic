"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_utils_1 = require("@ionic/cli-utils");
exports.CORDOVA_INTENT = 'CORDOVA';
function filterArgumentsForCordova(metadata, inputs, options) {
    const results = cli_utils_1.filterOptionsByIntent(metadata, options, exports.CORDOVA_INTENT);
    const args = cli_utils_1.minimistOptionsToArray(results);
    return [metadata.name].concat(inputs, args);
}
exports.filterArgumentsForCordova = filterArgumentsForCordova;
function gatherArgumentsForCordova(metadata, inputs, options) {
    const args = cli_utils_1.minimistOptionsToArray(options);
    return [metadata.name].concat(inputs, args);
}
exports.gatherArgumentsForCordova = gatherArgumentsForCordova;
function generateBuildOptions(metadata, options) {
    const results = cli_utils_1.filterOptionsByIntent(metadata, options);
    return Object.assign({}, results, { 'iscordovaserve': true, 'externalIpRequired': true, 'nobrowser': true });
}
exports.generateBuildOptions = generateBuildOptions;

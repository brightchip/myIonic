"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function minimistOptionsToArray(options) {
    return (Object.keys(options || {})).reduce((results, optionName) => {
        if (options[optionName] === true) {
            return results.concat(`--${optionName}`);
        }
        if (typeof options[optionName] === 'string') {
            return results.concat(`--${optionName}`, options[optionName]);
        }
        return results;
    }, []);
}
exports.minimistOptionsToArray = minimistOptionsToArray;

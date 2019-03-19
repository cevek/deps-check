import {dirname} from 'path';

export default function(packageJSONFile: string) {
    const projectDir = dirname(packageJSONFile);
    const json = require(packageJSONFile);
    const semver = require('semver');
    const deps = {...json.dependencies, ...json.devDependencies};
    for (const pkg in deps) {
        const requiredVersion = deps[pkg];
        const currentVersion = require(projectDir + '/node_modules/' + pkg + '/package.json').version;
        if (/#/.test(currentVersion)) continue;
        if (requiredVersion === 'latest') continue;
        if (!semver.satisfies(currentVersion, requiredVersion)) {
            throw new Error(`${pkg}: installed: ${currentVersion}, expected: ${requiredVersion}`);
        }
    }
}

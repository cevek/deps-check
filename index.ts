import {dirname} from 'path';
import {existsSync} from 'fs';

let projectDir = '';
for (let i = 0; i < require.main!.paths.length; i++) {
    const path = dirname(require.main!.paths[i]);
    if (existsSync(path + '/package.json')) {
        projectDir = path;
        break;
    }
}
if (projectDir === '') throw new Error('root package.json is not found');
const json = require(projectDir + '/package.json');
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

export {}
// @prettier
// @flow

import request from 'request';
import semver from 'semver';
import chalk from 'chalk';
import _ from 'lodash';

const CHANGELOG_BASE_URL = 'https://github.com/verdaccio/verdaccio/releases/tag/';
const VERDACCIO_LATEST_NPM_URL = 'http://registry.npmjs.org/verdaccio/latest';

/**
 * Creates NPM update banner using chalk
 */
export function createBanner(currentVersion: string, newVersion: string, releaseType: string): string {
    const changelog = `${CHANGELOG_BASE_URL}v${newVersion}`
    const versionUpdate = `${chalk.bold.red(currentVersion)} → ${chalk.bold.green(newVersion)}`
    const banner = chalk`
        {white.bold A new ${_.upperCase(releaseType)} version of Verdaccio is available on NPM. ${versionUpdate} }
        Run {green.bold npm install -g verdaccio} to update.
        {blue.bold Changelog: ${changelog}}
    `;
    return banner;
}


/**
 * Show verdaccio update banner on start 
 */   
export function verdaccioUpdateNotification(pkgVersion: string) {
    request(VERDACCIO_LATEST_NPM_URL, function (error: ?Object = null, response: Object = {}) {  
        if (_.isNil(error) === true) {
            const body = _.get(response, 'body', {});
            // In case, NPM does not returns version, keeping version equals to
            // verdaccio version.
            const { version = pkgVersion } = JSON.parse(body);
            const releaseType = semver.diff(version, pkgVersion);

            if (_.isNil(releaseType) === false && semver.gt(version, pkgVersion)) {
                // $FlowFixMe
                const banner = createBanner(pkgVersion, version, releaseType);
                /* eslint-disable-next-line */
                console.log(banner);
            }
        }
    });
}
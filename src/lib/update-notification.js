// @prettier
// @flow

import request from 'request';
import semver from 'semver';
import chalk from 'chalk';
import _ from 'lodash';

const CHANGELOG_BASE_URL = 'https://github.com/verdaccio/verdaccio/releases/tag/'

/**
 * 
 */
function createBanner(currentVersion, newVersion, releaseType) {
    const changelog = `${CHANGELOG_BASE_URL}v${newVersion}`
    const updateCommand = 'npm install -g verdaccio';
    /* eslint-disable */
    // $FlowFixMe
    console.log(chalk `
        {white.bold A new ${_.upperCase(releaseType)} version of Verdaccio is available on NPM. ${chalk.bold.red(currentVersion)} → ${chalk.bold.green(newVersion)}}
        Run {green.bold ${updateCommand}} to update.
        {yellow Changelog: ${changelog}}
    `);
    /* eslint-enable */
}


/**
 * Show verdaccio update banner on start 
 * @param {String} version 
 */
export function verdaccioUpdateNotification(pkgVersion: string) {
    const endpoint = 'http://registry.npmjs.org/verdaccio/latest'
    request(endpoint, function (error, response = {}) {
        if (_.isNil(error) === true) {
            const body = _.get(response, 'body', {});
            // In case, NPM does not returns version, keeping version equals to
            // verdaccio version.
            const { version = pkgVersion } = JSON.parse(body);
            const releaseType = semver.diff(version, pkgVersion)
            createBanner(pkgVersion, version, releaseType);
        }
    });
}
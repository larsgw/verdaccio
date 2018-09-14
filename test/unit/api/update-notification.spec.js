// @prettier
// @flow

import { 
    createBanner, 
    verdaccioUpdateNotification as notification 
} from '../../../src/lib/update-notification';

jest.mock('request', () => (url: string, resolver: Function) => {
    const response = {
        body: JSON.stringify({version: '4.5.6' })
    }
    resolver(null, response);
});

describe('Verdaccio update notification', () => {
    let log;

    beforeEach(() => {
        // mocking global console.log method
        global.console.log = jest.fn();
        log = global.console.log
    });

    test('should print major update notification', () => {
        notification('3.0.0');
        expect(log).toMatchSnapshot();
    });

    test('should print minor update notification', () => {
        notification('4.0.0');
        expect(log).toMatchSnapshot();
    });

    test('should print path update notification', () => {
        notification('4.5.0');
        expect(log).toMatchSnapshot();
    });

    test('when local version is equals to npm version', () => {
        notification('4.5.6');
        expect(log).not.toHaveBeenCalledWith();
    })

    test('when local version is greater than npm version', () => {
        notification('4.5.7');
        expect(log).not.toHaveBeenCalledWith();
    })
});

describe('create banner', () => {
    test('should create a banner', () => {
        expect(createBanner('1.0.0', '2.0.0', 'major')).toMatchSnapshot(); 
        expect(createBanner('1.0.0', '1.1.0', 'minor')).toMatchSnapshot(); 
        expect(createBanner('1.0.0', '1.0.1', 'patch')).toMatchSnapshot(); 
    })
});

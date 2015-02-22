/* 
* @Author: ben_cripps
* @Date:   2015-01-12 16:58:02
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-21 11:01:55
*/

'use strict';

require.config({
    baseUrl: '/',
    shim: {
        bootstrap: {
            deps: ['jquery']
        }
    },
    paths: {
        jquery: 'vendor/js/jquery.min',
        bootstrap: 'vendor/js/bootstrap.min',
        react: 'vendor/js/react.min',
        loginService: 'dev/scripts/modules/loginService',
        signUpService: 'dev/scripts/modules/signUpService',
        textService: 'dev/scripts/modules/textService',
        myAccountService: 'dev/scripts/modules/myAccountService',
        groupsService: 'dev/scripts/modules/groupsService',
        utilities: 'dev/scripts/modules/utilities',
        groupTable: 'dev/scripts/modules/react/js/groupTable'
    }
});
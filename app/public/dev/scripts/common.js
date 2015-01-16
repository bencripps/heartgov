/* 
* @Author: ben_cripps
* @Date:   2015-01-12 16:58:02
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-14 10:51:16
*/

'use strict';

require.config({
    baseUrl: '/',
    shim: {
        bootstrap: {deps: ['jquery'] }
    },
    paths: {
        jquery: 'vendor/js/jquery.min',
        bootstrap: 'vendor/js/bootstrap.min',
        loginService: 'dev/scripts/modules/loginService',
        signUpService: 'dev/scripts/modules/signUpService',
        textService: 'dev/scripts/modules/textService',
        utilities: 'dev/scripts/modules/utilities'
    }
});
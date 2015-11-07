/* 
* @Author: ben_cripps
* @Date:   2015-01-12 16:58:02
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-11-07 13:29:25
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
        loginService: path + '/scripts/modules/loginService',
        signUpService: path + '/scripts/modules/signUpService',
        textService: path + '/scripts/modules/textService',
        myAccountService: path + '/scripts/modules/myAccountService',
        groupsService: path + '/scripts/modules/groupsService',
        utilities: path + '/scripts/modules/utilities',
        groupTable: path + '/scripts/modules/react/js/groupTable',
        textTable: path + '/scripts/modules/react/js/textTable',
        searchBar: path + '/scripts/modules/react/js/component/searchBar', 
        groupModel: path + '/scripts/models/groupModel',
    }
});
/* 
* @Author: ben_cripps
* @Date:   2015-01-12 19:20:10
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-12 19:51:47
*/

'use strict';

require(['jquery', 'bootstrap', 'loginService', 'signUpService'], function($, bootstrap, loginService, signUpService){
    loginService.init();
    signUpService.init();
});
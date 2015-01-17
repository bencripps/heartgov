/* 
* @Author: ben_cripps
* @Date:   2015-01-17 12:50:51
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-17 12:51:19
*/

'use strict';

require(['jquery', 'bootstrap', 'loginService', 'myAccountService'], function($, bootstrap, loginService, myAccountService){
    loginService.init();
    myAccountService.init();
});
/* 
* @Author: ben_cripps
* @Date:   2015-01-17 12:50:51
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-10 19:42:26
*/

'use strict';

require(['jquery', 'bootstrap', 'loginService', 'groupsService'], function($, bootstrap, loginService, groupsService){
    loginService.init();
    groupsService.init();
});
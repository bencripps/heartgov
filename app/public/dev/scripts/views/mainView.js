/* 
* @Author: ben_cripps
* @Date:   2015-01-12 21:53:51
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-13 20:41:35
*/

'use strict';

require(['jquery', 'bootstrap', 'loginService', 'textService'], function($, bootstrap, loginService, textService){
    loginService.init();
    textService.init();
});
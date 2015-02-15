/* 
* @Author: ben_cripps
* @Date:   2015-02-14 22:07:30
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-14 22:20:18
*/

'use strict';

require(['jquery', 'bootstrap', 'utilities'], function($, bootstrap, utilities){

    var forgotPassword = {
        init: function() {
            document.getElementById('reset-password').addEventListener('click', this.resetPassword.bind(this));
        },
        resetPassword: function() {
            var data = {username: document.querySelector('input[name=\'username\']').value};
            utilities.ajax(data, 'post', '/reset/password', function() {
                alert('hi');
            });
        }
    };

    forgotPassword.init();
});
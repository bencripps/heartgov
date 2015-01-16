/* 
* @Author: ben_cripps
* @Date:   2015-01-11 16:30:36
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-14 15:04:57
*/

'use strict';

define('loginService', ['utilities'], function(utilities) {

    var loginService = {
        init: function() {
            var whichButton = document.getElementById('main-login') || document.getElementById('main-logout'),
                method = document.getElementById('main-login') ? this.attemptLogin.bind(this,{}) : this.logout.bind(this);
           
            whichButton.addEventListener('click', method);
        },
        attemptLogin: function(obj, e) {
            e.preventDefault();
            Array.prototype.forEach.call(document.querySelectorAll('#hgov-login-container input'), function(n) {
                obj[n.name] = n.value;
            });
            utilities.ajax(obj, 'post', '/login', function(response) {
                utilities.showModal(response);

                if (response.code > 0) setTimeout(utilities.redirect.bind(this, '/main'), 1000);
            });
        },
        logout: function() {
            utilities.ajax(false, 'post', '/logout', function(response) {
                utilities.redirect('/');
            });
        }
    };

    return loginService;

});
/* 
* @Author: ben_cripps
* @Date:   2015-01-11 16:30:36
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-02 19:03:29
*/

define('loginService', ['utilities'], function(utilities) {
    'use strict';
    
    var loginService = {
        init: function() {
            var whichButton = document.getElementById('main-login') || document.getElementById('main-logout'),
                imageDiv =  document.getElementById('all-image-src'),
                method = document.getElementById('main-login') ? this.attemptLogin.bind(this,{}) : this.logout.bind(this);
            utilities.fixpolygon();
            if (whichButton) whichButton.addEventListener('click', method);
            if (imageDiv) utilities.preloadImages();
        },
        attemptLogin: function(obj, e) {
            e.preventDefault();
            Array.prototype.forEach.call(document.querySelectorAll('.hgov-login-container input'), function(n) {
                obj[n.name] = n.value;
            });
            utilities.ajax(obj, 'post', '/login', function(response) {
                utilities.showModal(response);

                if (response.code > 0) setTimeout(utilities.redirect.bind(this, '/main'), 1000);
            });
        },
        logout: function() {
            utilities.ajax(false, 'post', '/logout', function() {
                utilities.redirect('/');
            });
        }
    };

    return loginService;

});
/* 
* @Author: ben_cripps
* @Date:   2015-01-11 16:30:36
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-11-07 14:06:25
*/

define('loginService', ['utilities'], function(utilities) {
    'use strict';
    
    var loginService = {
        init: function() {
            var whichButton = document.getElementById('main-login') || document.getElementById('main-logout'),
                imageDiv =  document.getElementById('all-image-src'),
                method = document.getElementById('main-login') ? this.attemptLogin.bind(this,{}) : this.logout.bind(this);

            if (whichButton) whichButton.addEventListener('click', method);
            if (imageDiv) utilities.preloadImages();

            document.addEventListener('keydown', (function(e) {
                if (window.location.pathname.indexOf('signin') === -1) return false;
                if (e.which === 13) this.attemptLogin({}, e);
            }).bind(this));
        },
        attemptLogin: function(obj, e) {
            e.preventDefault();
            Array.prototype.forEach.call(document.querySelectorAll('.hgov-login-container input'), function(n) {
                obj[n.name] = n.value;
            });
            utilities.ajax(obj, 'post', '/login', function(response) {
                utilities.showModal(response);
                document.cookie = 'key ' + response.key;
                console.log(response);
                if (response.code > 0) setTimeout(utilities.redirect.bind(this, response.city + '/database'), 1000);
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
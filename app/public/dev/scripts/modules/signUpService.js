/* 
* @Author: ben_cripps
* @Date:   2015-01-10 14:08:04
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-03-24 20:49:42
*/

define('signUpService', ['utilities'], function(utilities) {
    'use strict';
    
    var signUpService = {
        init: function() {
            this.form = document.getElementsByName('userSignup');
            this.signUpButton = document.getElementById('signupbutton');
            this.signUpButton.addEventListener('click', this.formSubmitted);
            this.form[0].addEventListener('keydown', utilities.resetState.bind(this, '.hgov-help-block'));
        },
        validateForm: function() {
            var values = this.getFormValues();

            if (values.username.length < 1) return 1;

            else if (values.password < 6) return 2;

            else if (values.firstName.length < 1) return 3;

            else if (values.lastName.length < 1) return 4;

            else if (!/^\S+@\S+\.\S+$/.test(values.emailAddress)) return 5;

            else if (values.phoneNumber.length < 10) return 6;

            else if (values.signupPassword.length < 1) return 7;

            else return 7;

        },
        getFormValues: function() {
            var obj = {};

            Array.prototype.forEach.call(document.querySelectorAll('form[name="userSignup"] input'), function(n) {
                obj[n.name] = n.value;
            });

            return obj;
        },
        showFormError: function(num) {
            var helpblocks = document.querySelectorAll('.hgov-help-block');
            helpblocks[num].style.display = 'block';
        },
        formSubmitted: function(e) {
            e.preventDefault();
            var valid = signUpService.validateForm();

            if (valid === 7) {

                utilities.ajax(signUpService.getFormValues(), 'post', '/createUser', function(response) { 
                    utilities.showModal(response);
                    if (response.code > 0) setTimeout(utilities.redirect.bind(this, '/database'), 3000);
                });

            }

            else {
                signUpService.showFormError(valid);
            }

        }
};


    return signUpService;

});
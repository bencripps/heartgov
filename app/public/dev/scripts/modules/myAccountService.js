/* 
* @Author: ben_cripps
* @Date:   2015-01-17 12:51:30
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-07 18:01:38
*/

define('myAccountService', ['utilities'], function(utilities) {
    'use strict';

    var myAccountService = {
        init: function(){
            this.editButton = document.getElementById('editbutton');
            this.saveButton = document.getElementById('savebutton');

            this.editButton.addEventListener('click', this.toggleEditFields.bind(this, 'edit'));
            this.saveButton.addEventListener('click', this.saveFields.bind(this, 'save'));
        },
        toggleButtons: function(action) {
            this.editButton.style.display = action === 'edit' ? 'none' : 'block';
            this.saveButton.style.display = action === 'edit' ? 'block' : 'none';
        },
        toggleEditFields: function(action, e) {
            e.preventDefault();
            this.toggleButtons.call(this, action);
            Array.prototype.forEach.call(document.querySelectorAll('input'), function(input, i) {
                if (input.name !== 'username' && input.name !== 'accountLevel') input.disabled = action !== 'edit';
            });
        },
        saveFields: function(action, e) {
            e.preventDefault();
            var me = this,
                obj = {},
                data = Array.prototype.forEach.call(document.querySelectorAll('input'), function(input) {
                    obj[input.name] = input.value; 
                });

            utilities.ajax(obj, 'post', '/edit/account', function(response) {
                myAccountService.toggleEditFields.call(me, 'save', e);
                utilities.showModal(response);
            });
        }
    };

    return myAccountService;
});
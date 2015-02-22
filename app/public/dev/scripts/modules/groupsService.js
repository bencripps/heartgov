/* 
* @Author: ben_cripps
* @Date:   2015-01-10 18:21:13
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-22 10:58:32
*/

define('groupsService', ['utilities'], function(utilities) {
    'use strict';
    var groupsService = {
        init: function() {
            this.userName = document.getElementById('hgov-user-information').innerHTML;
            this.form = document.querySelector('form[name=\'add-group-form\']');
            this.form.addEventListener('keydown', utilities.resetState.bind(this, '#groupName-help-block'));
            document.getElementById('create-group').addEventListener('click', this.createGroupModal.bind(this));
            document.getElementById('submit-create-group').addEventListener('click', this.createGroup.bind(this));
            utilities.reactClasses.getGroupTable('groupTable');
        },
        createGroupModal: function() {
            document.querySelector('input[name=\'creator\']').value = this.userName;
            utilities.modalPrompt('createGroup', 'show');
        },
        createGroup: function() {
            if (!this.validate.create()){
                document.getElementById('groupName-help-block').style.display = 'block';
            } 
            else {
                var data = {};

                Array.prototype.forEach.call(this.form.querySelectorAll('form[name=\'add-group-form\'] input'), function(n) {
                    data[n.name] = n.value;
                });

                utilities.ajax(data, 'post', '/create/group', function(response){
                    utilities.modalPrompt('createGroup', 'hide');
                    utilities.showModal(response);
                });
            }
        },
        validate: {
            create: function() {
                var name = document.querySelector('input[name=\'groupName\']').value;
                return name.length >= 6;
            }
        }

    };

    return groupsService;
});
    
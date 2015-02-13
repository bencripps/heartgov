/* 
* @Author: ben_cripps
* @Date:   2015-01-10 18:21:13
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-12 21:31:51
*/

/*jslint node: true */

define('groupsService', ['utilities'], function(utilities) {
    'use strict';
    var groupsService = {
        init: function() {
            document.getElementById('create-group').addEventListener('click', this.createGroupModal.bind(this));
            document.getElementById('submit-create-group').addEventListener('click', this.createGroup.bind(this));
            document.querySelector('form[name=\'add-group-form\']').addEventListener('keydown', utilities.resetState.bind(this, '#groupName-help-block'));
            this.userName = document.getElementById('hgov-user-information').innerHTML;
            this.form = document.getElementsByName('add-group-form');
        },
        createGroupModal: function() {
            document.querySelector("input[name='creator']").value = this.userName;
            $('.hgov-create-group-modal').modal();
        },
        createGroup: function() {
            if (!this.validate.create()){
                document.getElementById('groupName-help-block').style.display = 'block';
            }
        },
        validate: {
            create: function() {
                var name = document.querySelector("input[name=\"groupName\"]").value;
                console.log(name);
                return name.length >= 6;
            }
        }

    };

    return groupsService;
});
    
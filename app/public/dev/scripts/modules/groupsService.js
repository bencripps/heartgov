/* 
* @Author: ben_cripps
* @Date:   2015-01-10 18:21:13
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-19 20:26:29
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
            
            this.loadAvailableGroups();
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
                    groupsService.loadAvailableGroups();
                    utilities.showModal(response);
                });
            }
        },
        loadAvailableGroups: function() {
            utilities.ajax({username: utilities.getCurrentUserName()}, 'post', '/find/availableGroups', function(data) { 
                groupsService.buildTable(data.groups);
            });
        },
        buildTable : function(data) {
            var table = document.getElementById('hgov-group-table');
            
            if (data.length >= 1) {
                table.querySelector('tbody').innerHTML = '';
                data.forEach(function(group){
                    var tr = document.createElement('tr');
                    ['groupName'].forEach(function(key) {
                        var td = document.createElement('td');
                        td.innerHTML = group[key];
                        tr.appendChild(td);
                    });
                    table.querySelector('tbody').appendChild(tr);
                });
            }
            else {
                document.getElementById('no-groups').style.display = '';
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
    
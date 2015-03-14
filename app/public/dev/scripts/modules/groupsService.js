/* 
* @Author: ben_cripps
* @Date:   2015-01-10 18:21:13
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-03-14 13:59:16
*/

define('groupsService', ['utilities', 'groupModel'], function(utilities, Group) {
    'use strict';
    var groupsService = {
        init: function() {
            this.userName = document.getElementById('hgov-user-information').innerHTML;
            this.reactTable = utilities.reactClasses.getGroupTable('groupTable', this);
            this.setEvents();
        },
        setEvents: function() {
            this.form = document.querySelector('form[name=\'add-group-form\']');
            this.form.addEventListener('keydown', utilities.resetState.bind(this, '#groupName-help-block'));
            document.getElementById('create-group').addEventListener('click', this.createGroupModal.bind(this));
            document.getElementById('submit-create-group').addEventListener('click', this.createGroup.bind(this));
            document.getElementById('import-num').addEventListener('click', this.showImportModal);
            document.getElementById('submit-import').addEventListener('click', utilities.uploadFile.bind(this, 'fileUpload'));
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
        viewGroupModal: function(group, edit){

            var form = document.querySelector('form[name="group-details-form"]'),
                input,
                groupModel = Group.create(group);

            this.resetInputs(form.querySelectorAll('input'));

            groupModel.values.forEach(function(ob){
                if (!ob.iterable && ob.visible) {
                    input = form.querySelector('input[name="' + ob.id + '"]');
                    input.value = ob.value;
                }
                if (!ob.iterable && ob.editable && edit) input.disabled = false;

                if (ob.iterable) {
                    ob.value.forEach(function(val){
                        document.querySelector('form[name="' + ob.id + '"]').appendChild(utilities.getFormGroup(ob.label, val.value, !ob.editable));
                    });
                }
            });

            this.getSaveButton(groupModel, edit);

            this.getModifyButtons(groupModel, edit);

            utilities.modalPrompt('groupDetails', 'show');
        },
        resetInputs: function(inputs){
            document.querySelector('form[name="assoc-numbers"]').innerHTML = '';
            document.querySelector('form[name="assoc-users"]').innerHTML = '';
            Array.prototype.forEach.call(inputs, function(input){
                input.disabled = true;
            });
        },
        getSaveButton: function(model, edit) {
            document.getElementById('save-button').innerHTML = '';

            if (edit) {
                var saveButton = document.createElement('button');
                saveButton.className = 'btn btn-success';
                saveButton.innerHTML = 'Save';
                saveButton.addEventListener('click', model.save.bind(this, this.reactTable));
                saveButton.setAttribute('data-dismiss', 'modal');
                document.getElementById('save-button').appendChild(saveButton);
            } 
        },
        getModifyButtons: function(model, edit) {
            document.getElementById('add-numbers').innerHTML = '';
            document.getElementById('add-users').innerHTML = '';

            if (edit) {
                var addNumbers = document.createElement('button'),
                    addUsers = document.createElement('button');
                addNumbers.className = 'btn';
                addUsers.className = 'btn';
                addNumbers.innerHTML = 'Add Numbers';
                addUsers.innerHTML = 'Add Users';
                document.getElementById('add-numbers').appendChild(addNumbers);
                document.getElementById('add-users').appendChild(addUsers);

                addUsers.addEventListener('click', this.addInputToGroup.bind(this, 'assoc-users', 'User Name'));
                addNumbers.addEventListener('click', this.addInputToGroup.bind(this, 'assoc-numbers', 'Phone Number'));
            } 
        },
        addInputToGroup: function(name, label) {
            var form = document.querySelector('form[name="' + name + '"]');
            form.appendChild(utilities.getFormGroup(label, '', false));
        },
        editGroupModal: function(group){
            this.viewGroupModal(group, true);
        },
        removeGroupModal: function(group){
            var response = {result: 'Are you sure you\'d like to delete this group for all users?'},
                deleteButton = document.querySelector('.hgov-modal-text-delete');

            deleteButton.style.display = '';
            
            deleteButton.removeEventListener('click', utilities.ajax, false);
            deleteButton.addEventListener('click', utilities.ajax.bind(this, {id: group._id}, 'post', '/delete/group', function(response) {  
                window.location.reload();
            }));
            utilities.showModal(response);
        },
        showImportModal: function() {
            utilities.modalPrompt('importNum', 'show');
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
    
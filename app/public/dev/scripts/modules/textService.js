/* 
* @Author: ben_cripps
* @Date:   2015-01-12 21:51:52
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-07-18 12:54:24
*/

define('textService', ['utilities'], function(utilities) {
    'use strict';
    
    var textService = {
        init: function() {
            this.newTable = document.querySelector('#hgov-main-table');
            document.getElementById('send-out-going-text').addEventListener('click', this.sendOutGoingText.bind(this));
            document.addEventListener('keydown', utilities.resetState.bind(this, '.hgov-help-block-reply-form'));
            document.querySelector('.hgov-modal-add-group').addEventListener('click', this.addPhoneNumberToGroup);
            document.querySelector('#send-general-text').addEventListener('click', this.showRespondModal.bind(this));
            this.loadAvailableGroups();
            utilities.reactClasses.getTextTable('text-table', this);
            utilities.initContextSwitcher();
        },
        loadAvailableGroups: function() {
            utilities.ajax({username: utilities.getCurrentUserName()}, 'post', '/find/availableGroups', function(data){
                var select = document.getElementById('all-groups'),
                    button = document.querySelector('.hgov-modal-add-group'),
                    option;
                if (data.groups.length >= 1){
                    data.groups.forEach(function(group) {
                        button.style.display = '';
                        option = document.createElement('option');
                        option.text = group.groupName;
                        option.value = group.groupId;
                        select.appendChild(option);
                    });
                }
                else {
                    button.style.display = 'none';
                    option = document.createElement('option');
                    option.text = 'No Groups Available';
                    select.appendChild(option);
                }
                
            });
        },
        getTexts: function(filter) {

        },
        sendOutGoingText: function() {
            var obj = {_id: this.currentText._id};
            var formValues = Array.prototype.forEach.call(document.getElementsByName('out-going-text-form')[0].querySelectorAll('.input-sm'), function(n) {
                obj[n.name] = n.value;
            });

            obj.city = location.pathname;
            
            if (obj.content) {
                utilities.ajax(obj, 'post', '/send/outgoingText', function(response){
                    utilities.modalPrompt('textReply', 'hide');
                    utilities.showModal(response);
                });
            }

            else {
                document.querySelector('.hgov-help-block-reply-form').style.display = 'block';
            }
        },
        showRespondModal: function(data) {
            utilities.modalPrompt('textReply', 'show');
            document.getElementsByName('to')[0].disabled = !!data.phoneNumber;
            document.getElementsByName('to')[0].value = data.phoneNumber || '';
            document.getElementsByName('from')[0].value = utilities.getCurrentUserName();
            document.getElementsByName('content')[0].value = '';
            textService.currentText = data;
        },
        showDeleteModal: function(data) {
            var response = {result: 'Are you sure you\'d like to delete this text?'},
                deleteButton = document.querySelector('.hgov-modal-text-delete');

            deleteButton.style.display = '';

            deleteButton.addEventListener('click', utilities.ajax.bind(this, {id: data._id}, 'post', '/delete/text', function(response) {  
                window.location.reload();
            }));
            utilities.showModal(response);
        },
        showDetailsModal: function(data) {
            var form = document.querySelector('form[name="text-details-form"]'),
                responseForm = document.querySelector('form[name="text-responses"]'),
                responses = this.getResponseDivs(data),
                input;

            Object.keys(data).forEach(function(k){
                input = form.querySelector('input[name="' + k + '"]');
                if (input) input.value = data[k];
                if (k === 'allResponses') input.value = data[k].length;
            });

            responseForm.innerHTML = '';
            responseForm.appendChild(responses);

            utilities.modalPrompt('textDetails', 'show');
        },
        getResponseDivs: function(data){
            var container = document.createElement('div');

            data.allResponses.forEach(function(t){
                container.appendChild(utilities.getFormGroup(t.from, t.content, true));
            });
            
            return container;
        },
        addToGroup: function(data) {
            document.querySelector('.hgov-group-modal input').value = data.phoneNumber;
            utilities.modalPrompt('addPhoneNumberToGroup', 'show');
        },
        addPhoneNumberToGroup: function() {
            var ob = {};
            Array.prototype.forEach.call(document.querySelectorAll('form[name="add-to-group-form"] .add-number'), function(n) {
                ob[n.name] = n.value;
            });

            utilities.ajax(ob, 'post', 'add/phonenumber/group', function(response) {
                utilities.showModal(response);
            });
            
        }
    };

    return textService;

});
/* 
* @Author: Ben
* @Date:   2015-01-14 10:05:07
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-03-18 19:31:18
*/

define('utilities', ['groupTable', 'textTable'], function(groupTable, textTable){
    'use strict';
    
    var utilities = {
        redirect: function(location) {
            window.location.pathname = location;
        },
        ajax: function(data, method, to, callback) {

            var req = new XMLHttpRequest(),
                reqData = data ? JSON.stringify(data) : undefined,
                response;

            req.open(method, to, true);

            req.setRequestHeader('Content-Type', 'application/json');

            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    response = JSON.parse(req.response);
                    if (callback) callback(response);
                }
            };

            req.send(reqData);
        },
        showModal: function(response, id) {
            var tagId = id ? id : '.hgov-modal',
                bodyId = id ? '.hgov-modal-body' : '.hgov-modal-body-all';
            document.querySelector(bodyId).innerHTML = response.result;
            $(tagId).modal('show');
        },
        resetState: function(selector) {
            Array.prototype.forEach.call(document.querySelectorAll(selector), function(n) {
                n.style.display = 'none';
            });
        },
        preloadImages: function() {
            Array.prototype.forEach.call(document.querySelectorAll('#all-image-src span'), function(n) {
                var img = document.createElement('img');
                img.src = n.innerHTML;
            });
        },
        fixpolygon: function() {
            // var angle = document.querySelector('.angle-left');
            // if (angle) {
            //     angle.style.borderLeft = (0.9665 * window.innerWidth) + 'px solid transparent';
            //     window.addEventListener('resize', function() {
            //         angle.style.borderLeft = (0.9665 * window.innerWidth) + 'px solid transparent';
            //     });
            // }
        },
        modalPrompt: function(selector, method) {
            $(this.modals[selector]).modal(method);
        },
        getCurrentUserName: function() {
            return document.getElementById('hgov-user-information').innerHTML;
        },
        getCurrentUserLevel: function() {
            /*jslint evil: true */
            return eval(document.querySelector('.hgov-key').innerHTML);
        },
        modals: {
            general: '.hgov-modal',
            textReply: '.hgov-reply-modal',
            addPhoneNumberToGroup: '.hgov-group-modal',
            createGroup: '.hgov-create-group-modal',
            textDetails: '.hgov-text-details',
            groupDetails: '.hgov-group-details',
            importNum: '.hgov-import-group-modal'
        },
        closest: function(selector, elem) {
            var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
            while (elem) {
                if (matchesSelector.call(elem, selector)) {
                    return elem;
                }

                else {
                    elem = elem.parentElement;
                }

            } 
        return false;
        },
        reactClasses: {
            getGroupTable: function(id, service) {
                return groupTable.init(id, utilities, service);
            },
            getTextTable: function(id, service){
                textTable.init(id, utilities, service);
            }
        },
        getFormGroup: function(label, value, isDisabled, isRemoveable) {
            var formGroup = document.createElement('div'),
                inputGroup = document.createElement('div'),
                addOn = document.createElement('div'),
                input = document.createElement('input'),
                del = document.createElement('span');

            formGroup.className = 'form-group';
            inputGroup.className = 'input-group hgov-form-group';
            addOn.className = 'input-group-addon hgov-form-label';
            input.className = 'form-control input-sm hgov-disabled';
            del.className = 'glyphicon glyphicon-remove del';

            addOn.innerHTML = label;

            if (isRemoveable) {
                del.addEventListener('click', this.removeFormGroup.bind(this, formGroup));
                addOn.appendChild(del);
            }   
            
            input.value = value;
            input.disabled = isDisabled;
            inputGroup.appendChild(addOn);
            inputGroup.appendChild(input);
            formGroup.appendChild(inputGroup);
            return formGroup;
        },        
        removeFormGroup: function(formGroup) {
            formGroup.remove();
        },
        uploadFile: function(id) {
            var input = document.getElementById(id);

            if (input.files.length !== 0) {

                if (input.files[0].name.match('.xlsx')) {
                    utilities.ajax(input.files[0], 'post', '/upload/import', function(response){
                        utilities.modalPrompt('importNum', 'hide');
                        utilities.showModal({result: 'Your file has been successfully uploaded'});
                    });

                }

                else {
                    utilities.modalPrompt('importNum', 'hide');
                    utilities.showModal({result: 'Only Excel Files are accepted (.xlsx).'});
                }
            }

        }
    };

    return utilities;
});
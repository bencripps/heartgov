/* 
* @Author: Ben
* @Date:   2015-01-14 10:05:07
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-08-23 20:30:20
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
                contentType = 'application/json',
                response;
            
            req.open(method, to, true);

            req.setRequestHeader('Content-Type', contentType);

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
        modalPrompt: function(selector, method, callbackObj) {
            if (callbackObj) {
                //reset for any previously attached events
                document.querySelector(callbackObj.selector).outerHTML = document.querySelector(callbackObj.selector).outerHTML;
                document.querySelector(callbackObj.selector).addEventListener(callbackObj.eventType, callbackObj.func);
            }

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
        uploadFile: function(id, select) {
            var input = document.getElementById(id),
                group = select.selectedOptions.valueOf()[0].value,
                fileReader = new FileReader();

            if (input.files.length !== 0) {

                if (input.files[0].name.match('.csv')) {

                    fileReader.onload = function(e) {
                        
                        utilities.ajax({data: e.target.result, group: group}, 'post', '/upload/import', function(response){
                            utilities.modalPrompt('importNum', 'hide');
                            utilities.showModal({result: 'Your file has been successfully uploaded'});
                        });

                    };

                    fileReader.readAsText(input.files[0]);

                }

                else {
                    utilities.modalPrompt('importNum', 'hide');
                    utilities.showModal({result: 'Only CSV are accepted (.csv).'});
                }
            }

        },
        initContextSwitcher: function() {
            var switcher = document.querySelector('[name="context-switcher"]');
            
            if (switcher) {

                switcher.addEventListener('change', function(e){
                    location.pathname = e.target.value + location.pathname.substring(location.pathname.lastIndexOf('/'), location.pathname.length);
                });
            }
        },

        setLoading: function(isLoading, element) {
            var spinner = document.querySelector('#hgov-spinner-wrap');

            if (isLoading) {
                element.appendChild(spinner);
                element.firstChild.classList.add('is-loading');
                spinner.style.display = 'inline-block';
            }

            else {
                element.firstChild.classList.remove('is-loading');
                spinner.style.display = 'none';
            }

        }
    };

    return utilities;
});
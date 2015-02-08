/* 
* @Author: ben_cripps
* @Date:   2015-01-12 21:51:52
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-08 15:46:47
*/

define('textService', ['utilities'], function(utilities) {
    'use strict';
    
    var textService = {
        init: function() {
            this.newTable = document.querySelector('#hgov-main-table');
            utilities.ajax({date: -1}, 'post', '/find/texts', textService.buildTable);
            document.getElementById('send-out-going-text').addEventListener('click', this.sendOutGoingText.bind(this));
            document.addEventListener('keydown', utilities.resetState.bind(this, '.hgov-help-block-reply-form'));
        },
        getTexts: function(filter) {

        },
        currentText: null,
        sendOutGoingText: function() {
            var obj = {_id: this.currentText._id};
            var formValues = Array.prototype.forEach.call(document.getElementsByName('out-going-text-form')[0].querySelectorAll('.input-sm'), function(n) {
                obj[n.name] = n.value;
            });
            
            if (obj.content) {
                utilities.ajax(obj, 'post', '/send/outgoingText', function(response){
                    $('.hgov-reply-modal').modal('hide');
                    utilities.showModal(response);
                });
            }

            else {
                document.querySelector('.hgov-help-block-reply-form').style.display = 'block';
            }
        },
        buildTable:function(data){
            var level = document.querySelector('.hgov-key').innerHTML;
            if (data.result.length > 0) {
                data.result.forEach(function(row){
                    var template = textService.utils.getTemplate(document.createElement('tr'), row, data.displayTemplate, row._id),
                        innerLayout = textService.utils.getInnerLayout(document.createElement('tr'), row, data.innerLayoutTemplate, level);
            
                    textService.newTable.querySelector('tbody').appendChild(template);
                    textService.newTable.querySelector('tbody').appendChild(innerLayout);
                });
            }
            else {
                document.getElementById('no-texts').style.display = 'table-row';
            }
        },
        initClickEvents: function(node, e) {
            var current = document.getElementById('hide_' + node.id).style.display;
            document.getElementById('hide_' + node.id).style.display = current === 'table-row' ? 'none' : 'table-row';
        },
        showRespondModal: function(data) {
            $('.hgov-reply-modal').modal();
            document.getElementsByName('to')[0].value = data.phoneNumber;
            document.getElementsByName('from')[0].value = document.getElementById('hgov-user-information').innerHTML;
            document.getElementsByName('content')[0].value = '';
            textService.currentText = data;
        },
        showDeleteModal: function(data) {
            var response = {result: 'Are you sure you\'d like to delete this text?'},
                deleteButton =document.querySelector('.hgov-modal-text-delete');

            deleteButton.style.display = '';

            deleteButton.removeEventListener('click', utilities.ajax);
            deleteButton.addEventListener('click', utilities.ajax.bind(this, {id: data._id}, 'post', '/delete/text', function(response) {  
                window.location.reload();
            }));
            utilities.showModal(response);
        },
        showEditModal: function(data) {
            console.log(data);
        },
        addToGroup: function(data) {

        },
        utils: {
            getInnerLayout: function(row, data, obj, level) {
                Object.keys(obj).forEach(function(k) {
                    var el = document.createElement(obj[k].type);
                    el.className = obj[k].className;
                    el.colSpan = obj[k].colSpan;

                    if (obj[k].hasOwnProperty('innerHTML')) {
                        textService.utils.getTextUtilButtons(el, data, level);
                    }

                    else {
                        obj[k].labels.forEach(function(label, i){
                            var span = document.createElement('span');
                            span.innerHTML = ['<div><label>', label ,': </label> <span>', data[obj[k].contentKeys[i]],'</span></div>'].join('');
                            el.appendChild(span);
                        });
                    }

                    row.appendChild(el);
                });
                row.id = 'hide_' + data._id;
                row.className = 'hgov-hidden-row';
                return row;
            },
            getTh: function(text) {
                var th = document.createElement('td');
                th.innerHTML = text;
                return th;
            },
            getTextUtilButtons: function(el, data, level) {
                var respContainer = document.createElement('div'),
                    detailsContainer = document.createElement('div'),
                    deleteContainer = document.createElement('div'),
                    groupContainer = document.createElement('div'),
                    respondButton = document.createElement('span'),
                    groupButton = document.createElement('span'),
                    deleteButton = document.createElement('span'),
                    detailsButton = document.createElement('span');

                respondButton.className = 'glyphicon glyphicon-comment hgov-text-function';
                respondButton.title = 'click to respond';

                detailsButton.className = 'glyphicon glyphicon-search hgov-text-function';
                detailsContainer.title = 'click to update status';

                deleteButton.className = 'glyphicon glyphicon-remove hgov-text-function';
                deleteContainer.title = 'click to remove text';

                groupButton.className = 'glyphicon glyphicon-star hgov-text-function';
                groupContainer.title = 'click to add to group';

                respondButton.addEventListener('click', textService.showRespondModal.bind(this, data));

                detailsButton.addEventListener('click', textService.showEditModal.bind(this, data));

                deleteButton.addEventListener('click', textService.showDeleteModal.bind(this, data));

                groupButton.addEventListener('click', textService.addToGroup.bind(this, data));

                respContainer.appendChild(respondButton);
                detailsContainer.appendChild(detailsButton);
                deleteContainer.appendChild(deleteButton);
                groupContainer.appendChild(groupButton);

                el.appendChild(respContainer);
                /*jslint evil: true */
                if (eval(level)){
                    el.appendChild(detailsContainer);
                    el.appendChild(groupContainer);
                    el.appendChild(deleteContainer);
                }
            },
            getTemplate: function(row, data, obj, id) {
                Object.keys(obj).forEach(function(k) {
                    var el = document.createElement(obj[k].type);
                    el.className = obj[k].className;
                    el.colSpan = obj[k].colSpan;

                    if (obj[k].hasOwnProperty('innerHTML')) {
                        el.id = id;
                        el.innerHTML = obj[k].innerHTML;
                        el.addEventListener('click', textService.initClickEvents.bind(this, el));
                    }

                    else {
                        el.innerHTML = obj[k].label + data[obj[k].contentKey];
                    }

                    row.appendChild(el);
                });

                return row;
            },
            getTr: function(row, data) {
                data.forEach(function(n){
                    row.appendChild(n);
                });
                row.className = 'hgov-hidden-row';
                return row;
            }
        }
    };

    return textService;

});
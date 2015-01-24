/* 
* @Author: ben_cripps
* @Date:   2015-01-12 21:51:52
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-23 23:02:34
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
        sendOutGoingText: function() {
            var obj = {};
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
            data.result.forEach(function(row){
                var template = textService.utils.getTemplate(document.createElement('tr'), row, data.displayTemplate, row._id),
                    innerLayout = textService.utils.getInnerLayout(document.createElement('tr'), row, data.innerLayoutTemplate);
        
                textService.newTable.querySelector('tbody').appendChild(template);
                textService.newTable.querySelector('tbody').appendChild(innerLayout);
            });
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
        },
        showEditModal: function(data) {
            console.log(data);
        },
        utils: {
            getInnerLayout: function(row, data, obj) {
                Object.keys(obj).forEach(function(k) {
                    var el = document.createElement(obj[k].type);
                    el.className = obj[k].className;
                    el.colSpan = obj[k].colSpan;

                    if (obj[k].hasOwnProperty('innerHTML')) {
                        textService.utils.getTextUtilButtons(el, data);
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
            getTextUtilButtons: function(el, data) {
                var respContainer = document.createElement('div'),
                    editContainer = document.createElement('div'),
                    respondButton = document.createElement('span'),
                    editButton = document.createElement('span');

                respondButton.className = 'glyphicon glyphicon-comment hgov-text-function';
                respondButton.title = 'click to respond';

                respondButton.addEventListener('click', textService.showRespondModal.bind(this, data));

                editButton.addEventListener('click', textService.showEditModal.bind(this, data));

                editButton.className = 'glyphicon glyphicon-pencil hgov-text-function';
                editButton.title = 'click to update status';

                respContainer.appendChild(respondButton);
                editContainer.appendChild(editButton);

                el.appendChild(respContainer);
                el.appendChild(editContainer);
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
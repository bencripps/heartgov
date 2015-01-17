/* 
* @Author: ben_cripps
* @Date:   2015-01-12 21:51:52
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-17 12:52:26
*/

define('textService', ['utilities'], function(utilities) {
    'use strict';
    
    var textService = {
        init: function() {
            this.newTable = document.querySelector('#hgov-main-table');

            utilities.ajax({filter: null}, 'post', '/find/texts', textService.buildTable);
        },
        getTexts: function(filter) {

        },
        buildTable:function(data){
            data.result.forEach(function(row){
                var template = textService.utils.getTemplate(document.createElement('tr'), row, data.template),
                    columns = row.map(textService.utils.getTh),
                    innerTable = textService.utils.getTr(document.createElement('tr'), columns);
                    
                textService.newTable.querySelector('tbody').appendChild(template);
                textService.newTable.querySelector('tbody').appendChild(innerTable);
            });
        },
        initClickEvents: function(e,node) {
            console.log(e, node);
        },
        utils: {
            getTh: function(text) {
                var th = document.createElement('td');
                th.innerHTML = text;
                return th;
            },
            getTemplate: function(row, data, obj) {
                Object.keys(obj).forEach(function(k) {
                    var el = document.createElement(obj[k].type);
                    el.className = obj[k].className;
                    el.colSpan = obj[k].colSpan;

                    if (obj[k].hasOwnProperty('innerHTML')) {
                        el.innerHTML = obj[k].innerHTML;
                        el.addEventListener('click', textService.initClickEvents);
                    }

                    else {
                        el.innerHTML = obj[k].label + data[obj[k].contentIndex];
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
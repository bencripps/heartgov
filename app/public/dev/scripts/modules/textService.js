/* 
* @Author: ben_cripps
* @Date:   2015-01-12 21:51:52
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-14 10:52:27
*/

'use strict';

define('textService', ['utilities'], function(utilities) {

    var textService = {
        init: function() {
            this.table = document.querySelector('#hgov-main-table');
            this.requestData({filter: null});
        },
        getTexts: function(filter) {

        },
        updateTable: function(data) {

            data.result.forEach(function(row) {

                var tr = document.createElement('tr'),
                    columns = row.map(textService.utils.getTh);

                columns.forEach(function(col){
                    tr.appendChild(col);
                });
                textService.table.querySelector('tbody').appendChild(tr);
            });
        },
        requestData: function(data) {

            var req = new XMLHttpRequest(),
                reqData = JSON.stringify(data),
                response;

            req.open('post', '/find/texts', true);

            req.setRequestHeader('Content-Type', 'application/json');

            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    response = JSON.parse(req.response);
                    textService.updateTable(response);
                }
            };

            req.send(reqData);
        },
        utils: {
            getTh: function(text) {
                var th = document.createElement('td');
                th.innerHTML = text;
                return th;
            },
            getTr: function(row, data) {
                data.forEach(function(n){
                    row.appendChild(n);
                });
                return row;
            }
        }
    };

    return textService;

});
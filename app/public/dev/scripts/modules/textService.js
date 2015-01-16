/* 
* @Author: ben_cripps
* @Date:   2015-01-12 21:51:52
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-15 23:41:14
*/

'use strict';

define('textService', ['utilities'], function(utilities) {

    var textService = {
        init: function() {
            this.table = document.querySelector('#hgov-main-table');
            this.newTable = document.querySelector('#hgov-new-table');
            this.requestData({filter: null});

        },
        getTexts: function(filter) {

        },
        buildTable:function(data){
            data.result.forEach(function(row){
                var tr = document.createElement('tr'),
                    newTr = document.createElement('tr'),
                    template = textService.utils.getTemplate(tr, row),
                    columns = row.map(textService.utils.getTh),
                    innerTable = textService.utils.getTr(newTr, columns);


                console.log(innerTable)
                textService.newTable.querySelector('tbody').appendChild(template);
                textService.newTable.querySelector('tbody').appendChild(innerTable);
            });
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
                    textService.buildTable(response);
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
            getTemplate: function(row, data) {
                var td = document.createElement('td'),
                    td1 = document.createElement('td'),
                    td2 = document.createElement('td'),
                    span = document.createElement('td');

                span.className = 'glyphicon glyphicon-plus';
                td.colSpan = 1;
                td1.colSpan = 4;
                td2.colSpan = 5;

                td.className = "hgov-template-td"
                td1.className = "hgov-template-td"
                td2.className = "hgov-template-td"

                td.appendChild(span);

                row.appendChild(td);
                row.appendChild(td1);
                row.appendChild(td2);

                // td.innerHTML = '<span class="glyphicon glyphicon-exclamation-plus>hi</span>';
                td1.innerHTML = 'Recieved on' + data[0];
                td2.innerHTML = 'Content: ' + data[1];

                return row;
            },
            getTr: function(row, data) {
                data.forEach(function(n){
                    row.appendChild(n);
                });
                row.className = "hgov-hidden-row";
                return row;
            }
        }
    };

    return textService;

});
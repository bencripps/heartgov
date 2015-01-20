/* 
* @Author: Ben
* @Date:   2015-01-14 10:05:07
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-18 19:21:21
*/

define('utilities', function(){
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
            var id = id ? id : '.hgov-modal'
            document.querySelector('.hgov-modal-body').innerHTML = response.result;
            $(id).modal('show');
        },
    };

    return utilities;
});
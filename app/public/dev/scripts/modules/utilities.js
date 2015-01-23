/* 
* @Author: Ben
* @Date:   2015-01-14 10:05:07
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-22 21:05:30
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
            var tagId = id ? id : '.hgov-modal',
                bodyId = id ? '.hgov-modal-body' : '.hgov-modal-body-all';
            document.querySelector(bodyId).innerHTML = response.result;
            $(tagId).modal('show');
        },
        fixpolygon: function() {
            var angle = document.querySelector('.angle-left');
            if (angle) {
                angle.style.borderLeft = (0.9665 * window.innerWidth) + 'px solid transparent';
                window.addEventListener('resize', function() {
                angle.style.borderLeft = (0.9665 * window.innerWidth) + 'px solid transparent';
            });

            }
        }
    };

    return utilities;
});
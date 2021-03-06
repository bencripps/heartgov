/* 
* @Author: ben_cripps
* @Date:   2015-01-08 21:01:26
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-14 13:45:45
*/

'use strict';

var shortid = require('shortid'),
    idGenerator;

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!?');

idGenerator = {
    getId: function() {
        return shortid.generate();
    }
};


module.exports = idGenerator;  
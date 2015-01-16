/* 
* @Author: ben_cripps
* @Date:   2015-01-10 19:32:26
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-11 17:24:46
*/

'use strict';

/*jslint node: true */



var hasher = {
    encrpyt: function(password) {
        var hash = 0, i, chr, len;
        if (password.length === 0) return hash;
        
        for (i = 0, len = password.length; i < len; i++) {
            chr = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return String(hash);
    }
};

module.exports = hasher;

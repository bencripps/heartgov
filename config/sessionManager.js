/* 
* @Author: ben_cripps
* @Date:   2015-01-11 17:35:56
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-12 09:45:47
*/

/*jslint node: true */

'use strict';

var sessionManager =  {
    set: function(session, request) {
        session = session || request;
        return request.save();
    },
    login: function(session, email) {
        session.loggedIn = email;
    },
    logout: function(session, newSession) {
        session = newSession;
        return session.save();
    }
};

module.exports = sessionManager;
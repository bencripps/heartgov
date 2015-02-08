/* 
* @Author: ben_cripps
* @Date:   2015-01-11 17:35:56
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-08 15:52:38
*/

/*jslint node: true */

'use strict';

module.exports = function(shortId, loggedInUsers) {

    var sessionManager = {
        logout: function(sessionId) {
            var user = loggedInUsers.map(function(ob){return ob.key;}).indexOf(sessionId);
            if (user !== -1) {
                loggedInUsers.splice(user, 1);
            }
        },
        addUserToSession: function(server, username) {
            loggedInUsers.push({username: username, key: server.sessionID});          
            return server.sessionID;
        },
        isLoggedIn: function(sessionId) {
            return loggedInUsers.some(function(ob){return ob.key === sessionId;});
        },
        getLoggedInUser: function(sessionId) {
            if (this.isLoggedIn(sessionId)){
                return loggedInUsers.filter(function(ob){return ob.key === sessionId;})[0].username;
            }
            else {
                return false;
            }
        }
    };

    return sessionManager;
};

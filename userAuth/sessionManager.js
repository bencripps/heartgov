/* 
* @Author: ben_cripps
* @Date:   2015-01-11 17:35:56
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-14 13:44:06
*/

module.exports = function(shortId, loggedInUsers) {
    'use strict';
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

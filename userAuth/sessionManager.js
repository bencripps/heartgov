/* 
* @Author: ben_cripps
* @Date:   2015-01-11 17:35:56
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-07-15 19:29:28
*/

module.exports = function(shortId, Promise, loggedInUsers, adminUsers) {
    'use strict';
    var sessionManager = {
        logout: function(sessionId) {
            var user = loggedInUsers.map(function(ob){return ob.key;}).indexOf(sessionId);
            if (user !== -1) {
                loggedInUsers.splice(user, 1);
            }
        },
        addUserToSession: function(server, data) {
            loggedInUsers.push({username: data.username, key: server.sessionID, city: data.city});          
            return server.sessionID;
        },
        isLoggedIn: function(sessionId, devCredential) {

            return new Promise(function(success, reject){

                if (devCredential && devCredential.currentUser) {
                    
                    success({
                        isSuccessful: true,
                        user: devCredential.userDetails
                    });
                }

                else if (sessionId) {

                }

                else {
                    return reject({});
                }
            });

            // return loggedInUsers.some(function(ob){return ob.key === sessionId;});
        },
        getLoggedInUser: function(sessionId) {
            if (this.isLoggedIn(sessionId)){
                return false
                // return loggedInUsers.filter(function(ob){return ob.key === sessionId;})[0].username;
            }
            else {
                return false;
            }
        }
    };

    return sessionManager;
};

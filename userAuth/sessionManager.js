/* 
* @Author: ben_cripps
* @Date:   2015-01-11 17:35:56
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-07-17 19:45:40
*/

module.exports = function(shortId, loggedInUsers, adminUsers) {
    'use strict';
    var sessionManager = {
        logout: function(sessionId) {
            var user = loggedInUsers.map(function(ob){return ob.key;}).indexOf(sessionId);
            if (user !== -1) {
                loggedInUsers.splice(user, 1);
            }
        },
        addUserToSession: function(server, data) {
            loggedInUsers.push({username: data.username, key: server.sessionID, city: data.assignedCities[0]});    
        
            return server.sessionID;
        },
        isLoggedIn: function(sessionId, dev, devCredential, requestedLocation) {

            return new Promise(function(success, reject){

                if (dev && devCredential.currentUser) {
                    
                    success({
                        isSuccessful: true,
                        user: devCredential.userDetails,
                        location: requestedLocation || devCredential.userDetails.assignedCities[0]
                    });
                }

                else {

                    var user = loggedInUsers.filter(function(ob){ return ob.key === sessionId;});

                    if (user.length > 0) {
                        
                        adminUsers.getUser(user[0].username).then(function(user){ 
                            // if you're a super user, you can switch context, else, if you're requesting a city you have, you can go
                            // if you're not requesting a location (normal pages), and you have an account, you can go
                            // if you're asking for a city you dont have, and you arent a super user, you get bounced
                            if (user && (user.superUser || !requestedLocation || user.assignedCities.indexOf(requestedLocation) !== -1)) {

                                success({
                                    isSuccessful: true,
                                    user: user,
                                    location: user.superUser && requestedLocation ? requestedLocation : user.assignedCities[0]
                                });
                            }

                            else {
                                success({
                                    isSuccessful: false,
                                    user: false,
                                    location: user.assignedCities[0]
                                });
                            }

                        });

                    }

                    else {
                        success({
                            isSuccessful: false,
                            user: false,
                            location: ''
                        });
                    }
                }
            });

        },
        getCity: function(sessionId) {
            return loggedInUsers.map(function(ob){return ob.key === sessionId;}).city;
        },
        getLoggedInUser: function(sessionId) {
            
            if (loggedInUsers.filter(function(ob){return ob.key === sessionId;}).length > 1) {
                return loggedInUsers.filter(function(ob){return ob.key === sessionId;}).username;
            }

            return false;
        }
    };

    return sessionManager;
};

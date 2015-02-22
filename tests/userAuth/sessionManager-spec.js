/* 
* @Author: ben_cripps
* @Date:   2015-02-20 20:53:17
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-20 21:07:13
*/

'use strict';

var username = 'someUserId',
    sessionId ='kjk28dwjnjk2',
    sessionManager = require('../../userAuth/sessionManager.js')(require('shortId'), [{username: username, key: sessionId}]);

describe('The Application Session Manager', function() {

    it('Should return true if the user is logged in', function(){
        expect(sessionManager.isLoggedIn(sessionId)).toBeTruthy();
    });

    it('Should return false if the user is not logged in', function(){
        expect(sessionManager.isLoggedIn('sessionId')).toBeFalsy();
    });

    it('Should return the username of the user if they are logged in', function(){
        expect(sessionManager.getLoggedInUser(sessionId)).toEqual(username);
    });

    it('Should return false when requesting a username if they are not logged in', function(){
        expect(sessionManager.getLoggedInUser('sessionId')).toBeFalsy();
    });

});
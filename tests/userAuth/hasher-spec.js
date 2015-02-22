/* 
* @Author: ben_cripps
* @Date:   2015-02-20 20:32:46
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-20 20:49:44
*/

'use strict';

var hasher = require('../../userAuth/hasher.js');

describe('The central hashing service', function() {

    it('Should return the same string for the same password', function() {
        expect(hasher.encrypt('password')).toEqual(hasher.encrypt('password'));
    });

    it('Should return the different strings for the different passwords', function() {
        expect(hasher.encrypt('password')).toNotEqual(hasher.encrypt('notapassword'));
    });

    it('Should return a stringified number for any input', function() {
        expect(Number(hasher.encrypt('somep21sword1'))).toEqual(jasmine.any(Number));
    });

});
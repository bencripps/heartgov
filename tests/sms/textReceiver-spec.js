/* 
* @Author: ben_cripps
* @Date:   2015-02-19 21:41:51
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-21 10:22:39
*/

'use strict';
//need to add dependencies 
var textReceiver = require('../../sms/textReceiver.js')();

describe('Text Receiver\'s Get Category Function', function(){

    var getCategory = textReceiver.utils.getCategory;

    it('Should return false if no category is listed', function() {
        expect(getCategory('i have no category')).toBeFalsy();
    });

    it('Should return false if no category is listed', function() {
        expect(getCategory('i have a category (4)')).toBeTruthy();
    });

    it('Should handle extremely long texts', function() {
        expect(getCategory('i am an extremely long text. i am an extremely long text. i am an extremely long text. i am an extremely long text. i am an extremely long text. i am an extremely long text. i am an extremely long text. i am an extremely long text. i am an extremely long text. i am an extremely long text. i am an extremely long text. i am an extremely long text. i am an extremely long text. i am an extremely long text. i am an extremely long text. (4)')).toBeTruthy();
    });

    it('Should return the category even if it\'s listed to start the text', function() {
        expect(getCategory('(4) i have a category')).toBeTruthy();
    });

    it('Should return the category even if it\'s listed in the middle of the text', function() {
        expect(getCategory('i have a (4) category')).toBeTruthy();
    });

    it('Should return false if the number is greater than 4', function() {
        expect(getCategory('i have a (7) category')).toBeFalsy();
    });

});

describe('Text Receiver\'s Get Id Function', function(){ 

    var getId = textReceiver.utils.getId;

    it('Should return false if there is no tracking number', function(){
        expect(getId.call(textReceiver.utils, 'I have no tracking number')).toBeFalsy();
    });

    it('Should return true if there is a tracking number', function(){
        expect(getId.call(textReceiver.utils, 'I have a valid tracking number #1a3a67xs')).toBeTruthy();
    });

    it('Should return true if there is a tracking number to start the text', function(){
        expect(getId.call(textReceiver.utils, '#1a34a678 starts the text')).toBeTruthy();
    });

    it('Should return true if there is a tracking number in the middle of the text', function(){
        expect(getId.call(textReceiver.utils, 'The tracking number: #a8dn3l67 is in the middle.')).toBeTruthy();
    });

    it('Should return false if there is a tracking number is too short', function(){
        expect(getId.call(textReceiver.utils, 'The tracking number: #1a3d78 is in the middle.')).toBeFalsy();
    });

    it('Should return false if there is a tracking number in two peices', function(){
        expect(getId.call(textReceiver.utils, 'The tracking number: #1a3 d78 is in the middle.')).toBeFalsy();
    });

});

describe('Text Receiver\'s Get Category Function', function(){ 

    var hasTrackingNumber = textReceiver.user.hasTrackingNumber;

    it('Should return false if there is no tracking number', function(){
        expect(hasTrackingNumber('I have no tracking number')).toBeFalsy();
    });

    it('Should return false if the tracking number is less than 8 characters', function(){
        expect(hasTrackingNumber('I have too short of a tracking number #1234')).toBeFalsy();
    });

    it('Should return true if there is a valid tracking number', function(){
        expect(hasTrackingNumber('This is a valid tracking number #12345678')).toBeTruthy();
    });

    it('Should return true if the tracking number is valid and starts the message', function(){
        expect(hasTrackingNumber('#12345678 is a valid tracking number')).toBeTruthy();
    });

    it('Should return true if the tracking number is valid and is the middle of the message', function(){
        expect(hasTrackingNumber('This a valid tracking number: #12345678 in the middle of the message')).toBeTruthy();
    });

});

describe('Text Receiver\'s Mentions Category Function', function(){ 

    var mentionsCategory = textReceiver.utils.mentionsCategory;

    it('Should return false if there is no category', function(){
        expect(mentionsCategory('I have no category')).toBeFalsy();
    });

     it('Should return true if there is a category', function(){
        expect(mentionsCategory('I have a category (1)')).toBeTruthy();
    });

});
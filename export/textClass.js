/* 
* @Author: ben_cripps
* @Date:   2015-08-25 21:27:01
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-08-25 21:28:11
*/

'use strict';

var TextObject = function(number, zipcode) {
    this.values = {
        number: number,
        zipcode: zipcode || 'Not Found',
        responses: []
    };
};

TextObject.prototype.addResponse = function(response, i) {
    this.values.responses.push({
        question: i,
        responses: response
    });
};

module.exports = TextObject;
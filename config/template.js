/* 
* @Author: ben_cripps
* @Date:   2015-01-12 20:17:49
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-03-15 17:30:00
*/

module.exports = function(messages, path) {
    'use strict';
    
    var baseTemplate =  {
        title : messages.pageTitle, 
        local: path,
        scripts: null,
        prefix: messages.cssPrefix,
        loggedIn: null
    };

    var getUpdatedTemplate = function(map) {

        Object.keys(map).forEach( function(k) {
            baseTemplate[k] = map[k];
        });

        return baseTemplate;
    };

    return getUpdatedTemplate;

};
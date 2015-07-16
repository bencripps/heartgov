/* 
* @Author: ben_cripps
* @Date:   2015-01-12 20:17:49
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-07-14 20:05:10
*/

module.exports = function(messages, path) {
    'use strict';
    
    var baseTemplate =  {
            escapedDir: '',  
            title : messages.pageTitle, 
            local: path,
            scripts: null,
            prefix: messages.cssPrefix,
            loggedIn: null,
            location: null
        };

    var getUpdatedTemplate = function(map) {

        Object.keys(map).forEach( function(k) {
            baseTemplate[k] = map[k];
        });
        return baseTemplate;
    };

    return getUpdatedTemplate;

};
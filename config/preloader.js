/* 
* @Author: ben_cripps
* @Date:   2015-02-02 18:20:43
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-02 18:46:32
*/

'use strict';

var fs = require('fs'),
    walker = require('walk');

module.exports = function(paths) {

    var loader = {
            getImages: function() {
                var files = [],
                    imgWalker = walker.walkSync('./' + paths.img, {
                        followLinks: false,
                        file: function(root, stat, next) {
                            files.push(stat.name);
                            next();
                        },
                        end: function() {
                            return files;
                        }
                    });
                return imgWalker._wcurfiles;
            }
    };

    return loader;
};
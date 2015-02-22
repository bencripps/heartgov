/* 
* @Author: ben_cripps
* @Date:   2015-02-21 11:08:06
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-21 11:13:31
*/
'use strict';

var process = require('child_process').exec;

process('jsx -w ../app/public/dev/scripts/modules/react/jsx ../app/public/dev/scripts/modules/react/js -x jsx --no-cache-dir', function(error, stdout, stderr) {

    if (error) {
        console.log('An error occurred. Please ensure you have jsx tools installed (npm install -g react-tools)');
        throw error;
    }

    else {
        console.log('JSX Watcher is running.');
    }

});
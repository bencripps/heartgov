module.exports = function(grunt) {

    console.log(process.argv[2])
    require('time-grunt')(grunt);

    require('load-grunt-config')(grunt, {
        jitGrunt: true
    });
    
};
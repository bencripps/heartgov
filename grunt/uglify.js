module.exports = {
    all: {
        files: [{
            expand: true,
            cwd: 'app/public/dev',
            src: 'scripts/**/*.js',
            dest: 'app/public/min'
        }]
    }
};
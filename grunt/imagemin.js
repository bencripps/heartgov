module.exports = {
    all: {
        files: [{
            expand: true,
            cwd: 'app/public/dev',
            src: ['images/*.{png,jpg,gif}'],
            dest: 'app/public/min/'
        }]
    }
};
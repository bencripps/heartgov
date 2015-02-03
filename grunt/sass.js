module.exports = {
    // Development settings
    dev: {
        options: {
            outputStyle: 'nested',
            sourceMap: true
        },
        files: [{
            expand: true,
            cwd: 'app/public/dev/styles',
            src: ['*.scss'],
            dest: 'app/public/min/styles',
            ext: '.css'
        }]
    },
    // Production settings
    prod: {
        options: {
            outputStyle: 'compressed',
            sourceMap: false
        },
        files: [{
            expand: true,
            cwd: 'app/public/dev/styles/',
            src: ['*.scss'],
            dest: 'app/public/min/styles',
            ext: '.css'
        }]
    }
};
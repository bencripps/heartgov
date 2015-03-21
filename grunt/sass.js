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
            expand: false,
            src: 'app/public/dev/styles/hgov.scss',
            dest: 'app/public/min/styles/main.css'
        }]
    }
};
module.exports = {

    dev: {
        options: {
            outputStyle: 'nested',
            sourceMap: true
        },
        files: [{
            expand: false,
            src: 'app/public/dev/styles/hgov.scss',
            dest: 'app/public/min/styles/main.css'
        }]
    },

    prod: {
        options: {
            outputStyle: 'nested',
            sourceMap: false
        },
        files: [{
            expand: false,
            src: 'app/public/dev/styles/hgov.scss',
            dest: 'app/public/min/styles/main.css'
        }]
    }
};
module.exports = {

    // Task options
    options: {
        limit: 4
    },
    // Dev tasks
    devFirst: [
        'clean'
    ],
    devSecond: [
        'sass:dev',
        'uglify'
    ],
    // Production tasks
    prodFirst: [
        'clean:all'
    ],
    prodSecond: [
        'sass:prod',
        'uglify'
    ],
    // Image tasks
    imgFirst: [
        'imagemin'
    ],
    cssOnly: [
        'clean:cssOnly',
        'sass:prod',
        'uglify'
    ],
    test: [
        'test:jasmine'
    ]
};
// Karma configuration
// Generated on Mon Mar 21 2016 04:25:36 GMT+0300 (MSK)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["browserify", "jasmine"],


    // list of files / patterns to load in the browser
    files: [
      "handymap/client/js/**/*.js",
      "handymap/client/tests/**/*spec.js"
    ],


    // list of files to exclude
    exclude: [
      "handymap/client/js/templates/**/*.mustache"
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        "handymap/client/js/**/*.js": ["browserify"],
        "handymap/client/tests/**/*spec.js": ["browserify"]
    },

    browserify: {
        debug: false,
        transform: [ "babelify", "hoganify" ]
    },


    // test results reporter to use
    // possible values: "dots", "progress"
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["mocha"],

    // plugins: [
    //   "karma-jasmine",
    //   "karma-mocha-reporter"
    // ],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DISABLE,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["PhantomJS"],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
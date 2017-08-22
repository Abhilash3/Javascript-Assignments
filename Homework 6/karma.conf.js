module.exports = function(config) {
    config.set({

    basePath: '',

    frameworks: ['jasmine', 'requirejs'],

    files: [
        { pattern: 'lib/**/*.js', included: false },
        { pattern: 'src/**/*.js', included: false },
        { pattern: 'spec/**/*.spec.js', included: false },
        { pattern: 'template/**/*.html', included: false },
        { pattern: 'test-app.js', included: true }
    ],
    
    exclude: [
        'app.js'
    ],

    preprocessors: {
        'src/**/*.js': 'coverage'
    },

    reporters: ['progress', 'coverage', 'html'],
 
    htmlReporter: {
      outputFile: 'tests/units.html',
            
      pageTitle: 'Unit Tests',
      subPageTitle: 'Search Youtube Test Suite',
      groupSuites: true,
      useCompactStyle: true,
      useLegacyStyle: false
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'],

    singleRun: false,

    concurrency: Infinity
    });
}

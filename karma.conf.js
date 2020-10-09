/*global module, require */

// Karma configuration
// Generated on Fri Jan 03 2014 22:31:12 GMT+0100 (CET)

module.exports = function (config) {
  'use strict';
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript'],
    files: ['src/**/*.ts'],
    exclude: ['src/index.js'],
    preprocessors: {
      "**/*.ts": ["karma-typescript"],
      'src/**/*.ts': 'coverage'
    },
    reporters: ['progress', 'karma-typescript', 'junit', 'coverage'],
    junitReporter: {
      outputDir: '',
      useBrowserName: false,
      outputFile: 'test-results.xml'
    },
    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.json",
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeNoSandbox'],

    customLaunchers: {
      ChromeNoSandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    captureTimeout: 60000,
    singleRun: false
  });
};

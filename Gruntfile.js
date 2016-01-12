module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
          local: {
            options: {
              reporter: 'spec',
              //captureFile: 'results.txt', // Optionally capture the reporter output to a file
              quiet: false, // Optionally suppress output to standard out (defaults to false)
              clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
              ui: 'tdd'
            },
            src: ['test/*.js']
          },
          shippable: {
            options: {
              reporter: 'mocha-junit-reporter',
              reporterOptions: {
                mochaFile: 'shippable/testresults/result.xml'
              },
              ui: 'tdd'
            },
            src: ['test/*.js']
          },

        },
        mocha_istanbul: {
            coverage: {
                src: 'test', // a folder works nicely
                options: {
                    mochaOptions: ['--ui', 'tdd'] // any extra options for mocha
                }
            }
        },
        mocha_phantomjs: {
            options: {
              reporter: 'xunit',
              output: 'tests/results/result.xml',
            },
            all: ['http://localhost:5000/welcome']
        },

        jshint: {
          files: ['Gruntfile.js', 'test/*.js', 'app.js'],
            options: {
              // options here to override JSHint defaults
              globals: {
                jQuery: true,
                console: true,
                module: true,
                document: true
              }
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    // grunt.loadNpmTasks('grunt-mocha'); Client Side testing
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['mochaTest:local', 'mocha_istanbul','jshint']);

    //Test
    grunt.registerTask('test', ['mochaTest:local','mocha_istanbul','jshint', 'mocha_phantomjs']);

    // Shippable
    grunt.registerTask('shippable', ['mochaTest:shippable', 'mocha_istanbul']);

    //Coverage
  grunt.registerTask('coverage', ['mocha_istanbul']);


};

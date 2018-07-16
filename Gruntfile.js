/* jshint node: true */
/* globals module: false */
/*eslint quotes: ["warn", "single"]*/
'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        eslint: {
            option: {
                config: '.eslintrc.json'
            },
            target: ['src/app/*.js']
        },
        clean: {
            dest: ['build']
        },
        copy: {
            lib: {
                expand: true,
                cwd: 'src/lib',
                src: ['**'],
                dest: 'build/lib'
            },
            main: {
                expand: true,
                cwd: 'src/app',
                src: ['**'],
                dest: 'build/app'
            },
            html: {
                expand: true,
                cwd: 'src/',
                src: ['*.html'],
                dest: 'build/'
            }
        },
        comments: {
            app: {
                // Target-specific file lists and/or options go here.
                options: {
                    singleline: true,
                    multiline: true,
                    keepSpecialComments: true
                },
                src: ['build/app/**/*.js'] // files to remove comments from
            }
        },
        removelogging: {
            dist: {
                // Clean up all js file inside "build/app" or its subfolders
                src: ['build/app/**/*.js']
            }
        },
        uglify: {
            options: {
                mangle: {
                    reserved: ['Dojo', ]
                }
            },
            app: {
                files: [{
                    expand: true,
                    src: ['build/app/**/*.js'],
                    rename: function (dst, src) {
                        // To keep the source js files and make new files as `*.min.js`:
                        // return dst + '/' + src.replace('.js', '.min.js');
                        // Or to override to src:
                        return src;
                    }
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-stripcomments');
    grunt.loadNpmTasks('grunt-remove-logging');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'copy', 'comments', 'uglify']);
    grunt.registerTask('production', ['clean', 'copy', 'comments', 'removelogging', 'uglify']);
    grunt.registerTask('copy-all', ['copy']);
    grunt.registerTask('copy-lib', ['copy:lib']);

};

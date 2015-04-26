'use strict';

module.exports = function(grunt) {

    //Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-css');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                process: function(src, filepath) {
                  if (filepath.substr(filepath.length - 2) === 'js') {
                    return '// Source: ' + filepath + '\n' +
                      src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                  } else {
                    return src;
                  }
                }
            },

            main: {
                src: ['src/app.js','src/controllers/*.js','src/controllers/*/*.js','src/services/*','src/init.js',
                      'src/config.js','src/directives.js','src/filters.js'],
                dest: 'public/js/main.js'
            },
            css: {
                src: ['src/css/*.css'],
                dest: 'public/css/aboutbtc.css'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n',
                mangle: false
            },

            main: {
                src: 'public/js/main.js',
                dest: 'public/js/main.min.js'
            }
        },

        cssmin:{
            css: {
                src: ['public/css/aboutbtc.css'],
                dest: 'public/css/aboutbtc.min.css'
            }
        },

        watch: {
            main: {
                files: ['src/**/*.js','src/*.js'],
                tasks: ['concat:main', 'uglify:main']
            },
            css: {
                files: [ 'src/css/*'],
                tasks: ['concat:css', 'cssmin:css']
            }
        }
   
    });

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    //Default task(s).
    grunt.registerTask('default', ['concat', 'cssmin','watch']);

    //Compile task (concat + minify)
    grunt.registerTask('compile', ['concat', 'uglify', 'cssmin']);


};
  
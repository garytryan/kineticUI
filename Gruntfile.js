var LIVERLOAD_PORT = 35729;

var lrSnippet = require('connect-livereload')({ port: LIVERLOAD_PORT });

var livereloadMiddleware = function(connect, options){
  return [
    lrSnippet,
    connect.static(options.base),
    connect.directory(options.base)
  ];
};

module.exports = function(grunt) {
  grunt.initConfig({
    distFolder: 'dist',
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: {
        src: ['<%= distFolder %>']
      }
    },

    uglify: {
      dist: {
        expand: true,
        cwd: 'app',
        src:['js/**/*.js'],
        dest: '<%= distFolder %>/'
      }
    },

    connect: {
      client: {
        options: {
          port: 9000,
          base: 'app',
          middleware: livereloadMiddleware
        }
      }
    },

    stylus: {
      client: {
        src: 'app/styl/style.styl',
        dest: 'app/css/style.css',
        compress: false
      },
      dist: {
        src: 'app/styl/style.styl',
        dest: 'app/css/style.css',
        compress: false
      }
    },

    watch: {
      client: {
        files: ['app/**/*'],
        tasks: [],
        options: {
          livereload:LIVERLOAD_PORT
        }
      },

      css: {
        files: 'app/styl/*.styl',
        tasks: ['preview'],
        options: { livereload: true }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', ['clean','uglify','stylus:dist']);
  grunt.registerTask('preview', ['stylus:client']);
  grunt.registerTask('default', ['connect:client', 'watch']);
};
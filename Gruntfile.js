module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['client/lib/angular/angular.min.js', 'client/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'client/lib/angular-ui-router/release/angular-ui-router.min.js'],
        dest: 'client/dist/production.js'
      }
    },


    // mochaTest: {
    //   test: {
    //     options: {
    //       reporter: 'spec'
    //     },
    //     src: ['test/*.js']
    //   }
    // },

    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      build: {
        src: 'client/dist/production.js',
        dest: 'client/dist/production.min.js'
      }

    },

    cssmin: {
      build: {
        src: ['client/lib/bootstrap-css-only/css/bootstrap.min.css', 'client/app/styles/styles.css'],
        dest: 'client/dist/style.min.css'
      }
    },

    jshint: {
      //enforces code standards
      files: [
        ['Gruntfile.js', 'client/app/**/*.js'],
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'client/lib/**/*.js',
          'client/dist/**/*.js'
        ]
      }
    },


    watch: {
      scripts: {
        files: [
          'client/app/**/*.js',
          'client/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'client/app/styles/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    }

    // git_deploy: {
    //   your_target: {
    //     options: {
    //       url: 'https://bdstein33@mrshortly1.scm.azurewebsites.net/mrshortly1.git'
    //     },
    //     src: 'app/*'
    //   }
    // }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-git-deploy');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'cssmin']);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', ['git_deploy']);



};

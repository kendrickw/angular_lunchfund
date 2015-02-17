module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    less: {
        development: {
            options: {
                paths: ["bower_components/bootstrap/less"]
            },
            files: {
                "public/css/site.css": "less/site.less" // destination file and source file
            }
        },
        production: {
            options: {
                paths: ["bower_components/bootstrap/less"],
                cleancss: true,
                compress: true,
                yuicompress: true,
                optimization: 2
            },
            files: {
                "public/css/site.min.css": "less/site.less" // destination file and source file
            }
        }
    },
    watch: {
      styles: {
        files: ['less/**/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }
  });    

  //grunt.registerTask('default', ['less', 'watch']);
    grunt.registerTask('default', ['less']);
};
module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
    
    jshint: {
      files: ['src/*.js']
    },
    
    nodeunit: {
      all: ['tests/*-tests.js'],
    },
    
    copy: {
      default: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    
		uglify: {
		  default: {
		    src: 'dist/<%= pkg.name %>.js',
		    dest: 'dist/<%= pkg.name %>.min.js'
		  }
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
	
	grunt.registerTask('default', ['jshint','nodeunit','copy','uglify']);
}

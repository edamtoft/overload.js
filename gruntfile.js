module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
    
    jshint: {
      files: ['src/<%= pkg.name %>.js']
    },
    
    nodeunit: {
      all: ['tests/<%= pkg.name %>-tests.js'],
    },
    
    
		uglify: {
		  default: {
		    src: 'src/<%= pkg.name %>.js',
		    dest: 'dist/<%= pkg.name %>.min.js'
		  }
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
	
	grunt.registerTask('default', ['jshint','nodeunit','uglify']);
}

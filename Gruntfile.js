/*global module */
module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*!\n * Peppermint touch slider\n * v. <%= pkg.version %> | <%= pkg.homepage %>\n * Copyright <%= pkg.author.name %> | <%= pkg.author.url %>\n *\n * MIT License\n */\n',
		uglify: {
			options: {
				banner: '<%= banner %>',
				mangle: {
					except: ['Peppermint', '$', 'jQuery']
				}
			},
			dist: {
				files: {
					'peppermint.min.js': ['src/peppermint.js']
				}
			}
		},
		concat: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: ['src/peppermint.js'],
				dest: 'peppermint.js',
			},
		},

		watch: {
			files: ['src/*.js'],
			tasks: ['build'],
		},
	});

	// build
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('build', ['uglify', 'concat']);
	grunt.registerTask('w', ['build', 'watch']);
	grunt.registerTask('default', 'build');
};
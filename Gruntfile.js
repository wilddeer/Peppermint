/*global module */
module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*!\n * Peppermint touch slider\n * v. <%= pkg.version %> | <%= pkg.homepage %>\n * Copyright <%= pkg.author.name %> | <%= pkg.author.url %>\n *\n * MIT License\n */\n',
		uglify: {
			options: {
				preserveComments: 'some',
				mangle: {
					except: ['Peppermint', '$', 'jQuery', 'eventBurrito']
				}
			},
			peppermint: {
				files: {
					'temp/peppermint.min.js': ['src/peppermint.js']
				}
			},
			burrito: {
				files: {
					'temp/eventburrito.min.js': ['src/burrito/eventburrito.js']
				}
			}
		},

		concat: {
			options: {
				banner: '<%= banner %>',
				separator: '\n'
			},
			full: {
				src: ['src/peppermint.js','src/burrito/eventburrito.js'],
				dest: 'peppermint.js',
			},
			min: {
				src: ['temp/peppermint.min.js','temp/eventburrito.min.js'],
				dest: 'peppermint.min.js',
			},
			pureFull: {
				src: ['src/peppermint.js'],
				dest: 'pure/peppermint.pure.js'
			},
			pureMin: {
				src: ['temp/peppermint.min.js'],
				dest: 'pure/peppermint.pure.min.js'
			}
		},

		watch: {
			files: ['src/*.js', 'package.json'],
			tasks: ['build']
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
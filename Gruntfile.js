/*global module */
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n * Peppermint touch slider\n * v. <%= pkg.version %> | <%= pkg.homepage %>\n * Copyright <%= pkg.author.name %> | <%= pkg.author.url %>\n *\n * Depends on Event Burrito (included) | https://github.com/wilddeer/Event-Burrito\n * MIT License\n */\n',
        bannerPure: '/*!\n * Peppermint touch slider\n * v. <%= pkg.version %> | <%= pkg.homepage %>\n * Copyright <%= pkg.author.name %> | <%= pkg.author.url %>\n *\n * Depends on Event Burrito | https://github.com/wilddeer/Event-Burrito\n * MIT License\n */\n',
        uglify: {
            options: {
                mangle: {
                    except: ['Peppermint', '$', 'jQuery', 'EventBurrito']
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
                dest: 'dist/peppermint.js',
            },
            min: {
                src: ['temp/peppermint.min.js','temp/eventburrito.min.js'],
                dest: 'dist/peppermint.min.js',
            },
            pureFull: {
                options: {
                    banner: '<%= bannerPure %>'
                },
                src: ['src/peppermint.js'],
                dest: 'dist/pure/peppermint.pure.js'
            },
            pureMin: {
                options: {
                    banner: '<%= bannerPure %>'
                },
                src: ['temp/peppermint.min.js'],
                dest: 'dist/pure/peppermint.pure.min.js'
            },
            cssRequired: {
                options: {
                    banner: '/* Peppermint minimal required styles */\n\n'
                },
                src: ['src/peppermint.required.css'],
                dest: 'dist/peppermint.required.css'
            },
            cssSuggested: {
                options: {
                    banner: '/* Peppermint required styles + default appearance styles */\n\n',
                    separator: '\n\n/* default appearance styles */\n'
                },
                src: ['src/peppermint.required.css', 'src/peppermint.appearance.css'],
                dest: 'dist/peppermint.suggested.css'
            }
        },

        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: ['pkg'],
                commit: true,
                commitMessage: 'tagging v. %VERSION%',
                commitFiles: ['.'],
                createTag: true,
                tagName: '%VERSION%',
                tagMessage: 'tagging v. %VERSION%',
                push: false
            }
        },

        shell: {
            push: {
                command: 'git push'
            },

            pushTags: {
                command: 'git push --tags'
            }
        },

        watch: {
            options: {
                atBegin: true
            },
            files: ['src/**/*.js', 'src/**/*.css', 'package.json'],
            tasks: ['build']
        },

        connect: {
            server: {
                options: {
                    port: 8002,
                    hostname: '*'
                }
            }
        }
    });

    // build
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('build', ['uglify', 'concat']);
    grunt.registerTask('release', ['bump-only:patch', 'uglify', 'concat', 'bump-commit', 'shell:push', 'shell:pushTags']);
    grunt.registerTask('default', ['connect', 'watch']);
};

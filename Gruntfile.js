'use strict';

module.exports = function (grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	var rewrite = require('connect-modrewrite');

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		yeoman: {
			// configurable paths
			app: 'app',
			dist: 'dist'
		},

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			js: {
				files: ['<%= yeoman.app %>/**/*.js'],
				tasks: ['newer:jshint:all'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			less: {
				files: [
					'<%= yeoman.app %>/**/*.less',
					'<%= yeoman.app %>/{,*/}*.less',
					'!<%= yeoman.app %>/bower_components/{,*/}*.{less}'
				],
				tasks: [
					'less'
				],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			gruntfile: {
				files: ['Gruntfile.js'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			livereload: {
				options: {
					livereload: true,
				},
				files: [
					'<%= yeoman.app %>/**/*.html',
					'.tmp/assets/styles/{,*/}*.css',
					'<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},

		// The actual grunt server settings
		//
		connect: {
			options: {
				port: 9000,
				protocol: 'http',
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: '127.0.0.1',
				livereload: 35729,
				middleware: function (connect, options) {

					var middleware = [];

					// 1. mod-rewrite behavior
					var rules = [
						'!\\.html|\\.js|\\.css|\\.svg|\\.jp(e?)g|\\.png|\\.gif|\\.woff2|\\.woff|\\.ttf|\\.svg$ /index.html'
					];
					middleware.push(rewrite(rules));

					// 2. original middleware behavior
					var base = options.base;
					if (!Array.isArray(base)) {
						base = [base];
					}
					base.forEach(function (path) {
						middleware.push(connect.static(path));
					});
					return middleware;
				}
			},
			livereload: {
				options: {
					open: true,
					base: [
						'.tmp',
						'<%= yeoman.app %>'
					]
				}
			},
			test: {
				options: {
					port: 9001,
					base: [
						'.tmp',
						'test',
						'<%= yeoman.app %>'
					]
				}
			},
			dist: {
				options: {
					base: '<%= yeoman.dist %>'
				}
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'<%= yeoman.app %>/{,}*.js',
				'!<%= yeoman.app %>/bower_components/{,*/}*.js',
				'!<%= yeoman.app %>/jspm_packages/{,*/}*.js',
				'!<%= yeoman.app %>/config.js'
			]
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= yeoman.dist %>/*',
						'!<%= yeoman.dist %>/.git*'
					]
				}]
			},
			server: '.tmp'
		},

		// Add vendor prefixed styles
		autoprefixer: {
			options: {
				browsers: ['last 1 version']
			},
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/assets/styles/',
					src: '{,*/}*.css',
					dest: '.tmp/assets/styles/'
				}]
			}
		},

		less: {
			development: {
				options: {
					paths: ['app']
				},
				files: {
					'.tmp/assets/styles/less_main.css': ['<%= yeoman.app %>/styles/main.less']
				}
			}
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			html: '<%= yeoman.app %>/index.html',
			options: {
				dest: '<%= yeoman.dist %>'
			}
		},

		// Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			html: ['<%= yeoman.dist %>/{,*/}*.html'],
			css: ['<%= yeoman.dist %>/assets/styles/{,*/}*.css'],
			options: {
				assetsDirs: ['<%= yeoman.dist %>'],
				blockReplacements: {
					script: function (block) {
						return '<script type="text/javascript" src="' + block.dest + '"></script>';
					}
				}
			}
		},

		// The following *-min tasks produce minified files in the dist folder
		htmlmin: {
			dist: {
				options: {
					collapseWhitespace: true,
					collapseBooleanAttributes: true,
					removeCommentsFromCDATA: true,
					removeOptionalTags: true
				},
				files: [{
					expand: true,
					cwd: '<%= yeoman.dist %>',
					src: ['*.html'],
					dest: '<%= yeoman.dist %>'
				}]
			}
		},
		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.dist %>',
					src: [
						'robots.txt',
						'index.html',
						'assets/**/*',
						'divshot.json'
					]
				}]
			}
		},

		// Run some tasks in parallel to speed up the build process
		concurrent: {
			server: [
				'less',
				'ngconstant:serve'
			],
			test: [
				'less'
			],
			dist: [
				'less'
			]
		},

		// Generate app/app-config.js
		ngconstant: {
			options: {
				name: 'ethive.config',
				dest: '<%= yeoman.app %>/app-config.js',
				deps: [],
				wrap: 'import angular from \'angular\';\n\nexport default {%= __ngModule %}'
			},
			serve: {
				// Development config
				constants: {
					config: {
						environment: 'development',
						apiRoot: 'http://127.0.0.1:3000/api'
					}
				}
			},
			dist: {
				// Production config
				constants: {
					config: {
						environment: 'production',
						apiRoot: 'https://ethiveserver-46660.onmodulus.net/api'
					}
				}
			}
		}
	});

	var Builder = require('systemjs-builder');

	grunt.registerTask('systemjs', function () {
		var done = this.async();
		var builder = new Builder();
		builder.loadConfig('app/config.js').then(function () {
			return builder.config({
				baseURL: 'app'
			});
		}).then(function () {
			return builder.buildSFX('init', 'dist/assets/scripts/scripts.js', {
				minify: false,
				sourceMaps: true
			});
		}).then(function () {
			console.log('Build complete');
			done();
		})
		.catch(function (err) {
			console.log('Build error');
			console.log(err);
			done(false);
		});
	});

	grunt.registerTask('serve', function (target) {
		if (target === 'dist') {
			return grunt.task.run([
				'ngconstant:serve',
				'build',
				'connect:dist:keepalive'
			]);
		}

		grunt.task.run([
			'clean:server',
			'concurrent:server',
			'autoprefixer',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('build', [
		'clean:dist',
		'useminPrepare',
		'concurrent:dist',
		'autoprefixer',
		'copy:dist',
		'concat',
		'cssmin',
		'systemjs',
		'usemin',
		'htmlmin'
	]);

	grunt.registerTask('default', [
		'ngconstant:dist',
		'newer:jshint',
		'build'
	]);
};
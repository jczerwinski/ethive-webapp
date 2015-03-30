// Generated on 2014-03-22 using generator-angular 0.7.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

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
			app: require('./bower.json').appPath || 'app',
			dist: 'dist'
		},

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			js: {
				files: ['<%= yeoman.app %>/**/*.js', '!<%= yeoman.app %>/bower_components/{,*/}*.js'],
				tasks: ['newer:jshint:all'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			//jsTest: {
			//  files: ['test/spec/{,*/}*.js'],
			//  tasks: ['karma']
			//},
			stylus: {
				files: [
					'<%= yeoman.app %>/**/*.styl',
					'!<%= yeoman.app %>/bower_components/{,*/}*.{styl}'
				],
				tasks: [
					'stylus',
					'autoprefixer'
				],
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
					'.tmp/styles/{,*/}*.css',
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
				hostname: 'localhost',
				livereload: 35729,
				middleware: function (connect, options) {

					var middleware = [];

					// Proxy
					middleware.push(require('grunt-connect-proxy/lib/utils').proxyRequest);

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
				},
				proxies: [{
					context: '/api',
					host: 'localhost',
					port: 3000,
					changeOrigin: false
				}]
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
				},
				proxies: [{
					context: '/api',
					host: 'localhost',
					port: 3000,
					changeOrigin: false
				}]
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
					cwd: '.tmp/styles/',
					src: '{,*/}*.css',
					dest: '.tmp/styles/'
				}]
			}
		},

		stylus: {
			compile: {
				files: {
					'.tmp/styles/stylus_main.css': ['<%= yeoman.app %>/**/*.styl', '!<%= yeoman.app %>/bower_components/**/*.styl']
				}
			}
		},

		less: {
			development: {
				options: {
					paths: ['app']
				},
				files: {
					'.tmp/styles/less_main.css': ['<%= yeoman.app %>/styles/main.less']
				}
			}
		},

		// Renames files for browser caching purposes
		rev: {
			dist: {
				files: {
					src: [
						'<%= yeoman.dist %>/scripts/{,*/}*.js',
						'<%= yeoman.dist %>/styles/{,*/}*.css',
						'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
						'<%= yeoman.dist %>/styles/fonts/*'
					]
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
			css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
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
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/images',
					src: '{,*/}*.{png,jpg,jpeg,gif}',
					dest: '<%= yeoman.dist %>/images'
				}]
			}
		},
		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/images',
					src: '{,*/}*.svg',
					dest: '<%= yeoman.dist %>/images'
				}]
			}
		},
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
					src: ['*.html', 'views/{,*/}*.html'],
					dest: '<%= yeoman.dist %>'
				}]
			}
		},

		// Allow the use of non-minsafe AngularJS files. Automatically makes it
		// minsafe compatible so Uglify does not destroy the ng references
		ngmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/concat/scripts',
					src: '*.js',
					dest: '.tmp/concat/scripts'
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
						'*.{ico,png,txt}',
						'.htaccess',
						'*.html',
						'images/{,*/}*.{webp}',
						'fonts/*'
					]
				}, {
					expand: true,
					cwd: '.tmp/images',
					dest: '<%= yeoman.dist %>/images',
					src: ['generated/*']
				}]
			},
			styles: {
				expand: true,
				cwd: '<%= yeoman.app %>/styles',
				dest: '.tmp/styles/',
				src: '{,*/}*.css'
			}
		},

		// Run some tasks in parallel to speed up the build process
		concurrent: {
			server: [
				'stylus',
				'less'
			],
			test: [
				'stylus',
				'less'
			],
			dist: [
				'stylus',
				'less',
				'imagemin',
				'svgmin'
			]
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
			return builder.buildSFX('init', 'dist/scripts/scripts.js', {
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
				'build',
				'configureProxies:dist',
				'connect:dist:keepalive'
			]);
		}

		grunt.task.run([
			'clean:server',
			'concurrent:server',
			'autoprefixer',
			'configureProxies:livereload',
			'connect:livereload',
			'watch'
		]);
	});

	/*	grunt.registerTask('test', [
			'clean:server',
			'concurrent:test',
			'autoprefixer',
			'connect:test',
			'karma'
		]);*/

	grunt.registerTask('build', [
		'clean:dist',
		'useminPrepare',
		'concurrent:dist',
		'autoprefixer',
		'copy:dist',
		'concat',
		'cssmin',
		'rev',
		'systemjs',
		'usemin',
		'htmlmin'
	]);

	grunt.registerTask('default', [
		'newer:jshint',
		//'test',
		'build'
	]);
};
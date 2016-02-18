/*
 * XIEL web development
 * created: august 2015
 */

'use strict';

/*
 * PERFORMANCE
 * 
 * 1. For performance reasons you should only matching one level down, if possible. 
 * 2. Try to keep your watch task clean. Do NOT watch everything (like icons).
 * 3. Add "spawn: false" to your watch task when you need to speed up your build.
 *
 */

module.exports = function(grunt) {
	
	// load only used tasks and add fallbacks for those which cannot be find
	require('jit-grunt')(grunt, {
		'replace': 'grunt-text-replace'
	});
	// measures the time each task takes
	require('time-grunt')(grunt);

	var options = {
	// Project settings
		config: {
			src: "grunt/configs/*.js"
		},

		// define your path structure
		paths: {
			src: 'sources', // resources folder with working files
			dev: '_dev', // dev/working folder
			dist: '_output',
			tmp: 'temp',
			helper: 'grunt/configs',
		},

		//ports for grunt-contrib-connect
		ports: {
			app: '8002',
			test: '9002',
			livereload: 35731
		}
	};

	grunt._rbOptions = options;

	// Load grunt configurations automatically
	var configs = require('load-grunt-configs')(grunt, options);

	// Define the configuration for all the tasks
	grunt.initConfig(configs);

	//load some tasks
	grunt.task.loadTasks('grunt/tasks');

	/*
	 *  SIMPLE TASKS
	 */
	
	grunt.registerTask('default', [
		'build'
	]);

	// Build task
	grunt.registerTask('build', [
		'dev',
		// 'connect:livereload',
		'watch'
	]);

	grunt.registerTask('css', [
		'scssglobbing',
		'sass:dev',
		'autoprefixer:dev',
		// 'clean:scssglobbing',
		// 'postcssSeparator:dev',
	]);

	// Sprites Task
	grunt.registerTask('icons', [
		'clean:icons',
		'svgmin',
		'grunticon',
		// 'replace',
		'css',
	]);

	grunt.registerTask('dev', [
		'clean:dist',
		'clean:dev',
		'clean:tmp',
		'icons',
		'css',
		'uglify:dev',
		'concurrent:dev2',
		'jst',
		'webpack:dev',
		'sync',
		'imagemin:dev',
		'prettify:dev',
	]);

	grunt.registerTask('dist', [
        'clean:dist',
        'clean:tmp',
        'scssglobbing',
        'sass:dist',
        'postcssSeparator:dist',
        'uglify:dist',
        // 'assemble:dist',
        'autoprefixer:dist',
        'cssmin',
        // 'copy:favicon',
        // 'handlebars:dist',
        'jst',
        'webpack:dist',
        // 'test',
        'copy',
        'imagemin:dist',
        // 'prettify:dist',
        'clean:scssglobbing',
    ]);
};
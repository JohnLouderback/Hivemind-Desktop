module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		ts: {
			options: {
				compiler: './node_modules/typescript/bin/tsc',
				target: 'es5',
				module: 'commonjs'
			},
			default : {
				src: ["**/*.ts", "!node_modules/**/*.ts", "!components/**/*.ts", "!tectonic/**/*.ts", "!dist/**/*.ts", "!Tectonic-Src/**/*"],
				outDir: 'dist/'
			}
		},
		copy: {
			temp: {
				expand: true,
				src: ['images/**/*', 'themes/**/*', 'resources/**/*', 'tectonic/**/*'],
				dest: 'dist/'
			}
		}
	});

	// Load the plugins
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Register task(s).
	grunt.registerTask('backend', ['ts', 'copy']);

};
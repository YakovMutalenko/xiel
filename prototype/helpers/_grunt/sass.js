module.exports = {
	options: {
		outputStyle: 'nested',
		sourceMap: false
	},
	dist: {
		files: {
			'<%= paths.dev %>/css/styles.css': '<%= paths.src %>/scss/styles.scss'
		}
	},
	universal: {
		files: {
			'<%= paths.dev %>/css/universal.css': '<%= paths.src %>/scss/universal.scss'
		}
	}
};
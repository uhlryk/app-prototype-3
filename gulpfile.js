var gulp = require('gulp'),
gutil = require("gulp-util"),
concat = require("gulp-concat"),
prompt = require("gulp-prompt")
;

gulp.task('build', function () {
	return gulp.src('/')
	.pipe(prompt.prompt({
		type: 'input',
		name: 'env',
		message: 'Which environment [local_dev, local_test, production_dev, production] would you like to run?'
	}, function(res){
		var configSrc = './components/config/';
		gulp.src(configSrc + res.env + '/config.js')
		.pipe(gulp.dest('./project/config/'))
		;
	}));
});
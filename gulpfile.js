var gulp = require('gulp'),
gutil = require("gulp-util"),
concat = require("gulp-concat"),
prompt = require("gulp-prompt"),
zip = require('gulp-zip'),
scp = require('gulp-scp'),
gulpSSH = require('gulp-ssh')
;
/**
 * komendy do wywołania:
 * gulp build
 * gulp zip
 * gulp upload_production_dev
 * gulp install_producion_dev
 */

gulp.task('build', function () {
	return gulp.src('/')
	.pipe(prompt.prompt({
		type: 'input',
		name: 'env',
		message: 'Which environment [local_dev, local_test, production_dev, production] would you like to run?'
	}, function(res){
		if(res.env === "template") {
			throw "No template environment";
		}
		var configSrc = './components/config/';
		gulp.src(configSrc + res.env + '/config.js')
		.pipe(gulp.dest('./project/config/'))
		;
	}));
});
var appStructure = [
	'project/**/*',
	'package.json'
];
gulp.task("zip", function(){
	return gulp.src(appStructure, { base: '.' })
	.pipe(zip('app.zip'))
	.pipe(gulp.dest(''));
});

var authSSHProductionDev = {
	ignoreErrors: false,
	sshConfig: {
		host: '188.166.29.141',
		username: 'admin',
		password: 'asd!@#QWE'
	}
};
gulp.task('upload_production_dev', function () {
	gulp.src('app.zip')
	.pipe(scp({
		host: authSSHProductionDev.sshConfig.host,
		user: authSSHProductionDev.sshConfig.username,
		port: 22,
		path: '~/projects/loyteam/server_project/'
	}));
});
gulp.task('install_production_dev', function () {
	return gulpSSH(authSSHProductionDev)
	.shell(['cd ~/projects/loyteam/server_project', 'forever stopall', 'unzip -o app.zip -d .', 'rm app.zip', 'npm install', 'cd ..', 'sh starter.sh'], {filePath: 'production_dev_unzip.log'})
	.pipe(gulp.dest('logs'));
});

'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('scripts', function () {
	gulp.src('src/**/*.js')
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(concat('ng-entrust.js'))
		.pipe(gulp.dest('dist'));
});
'use strict';

var gulp = require('gulp'),
  connect = require('gulp-connect'),
  sass = require('gulp-sass'),
  opn = require('opn'),
  autoprefixer = require('gulp-autoprefixer'),
  livereload = require('gulp-livereload'),
	tinify = require('gulp-tinify'),
  minifyCss = require('gulp-minify-css'),
  path     = require('path'),
  rename   = require('gulp-rename'),
 	translit = require('translitit-cyrillic-russian-to-latin');


gulp.task('files', function () {
     gulp.src('app/img/png/*.*')
		 .pipe(rename(function (path) {
          path.basename = translit(path.basename);
      }))
.pipe(gulp.dest('app/img/renamed/png/'));
});

tinify.key = "8ayr6W76teW99I2KbDh33tFtfh3MzHh8";

gulp.task('tinify', function() {
	gulp.src('app/img/renamed/png/*.png')
		.pipe(tinify('8ayr6W76teW99I2KbDh33tFtfh3MzHh8'))
		.pipe(gulp.dest('app/img/'));
})

gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true,
    port:8888
  });
  opn('http://localhost:8888');
});


gulp.task('html', function () {
  gulp.src('./app/*.html')
  .pipe(livereload());
});

gulp.task('sass', function () {
  gulp.src('./app/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(minifyCss())
    .pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
    .pipe(gulp.dest('./app/css'))
    .pipe(livereload());
});

gulp.task('js', function () {
  gulp.src('./app/js/*.js')
    .pipe(livereload());
});

//bower */
gulp.task('bower', function () {
  gulp.src('./app/index.html')
    .pipe(wiredep({
      odirectory : "app/bower"
    }))
    .pipe(gulp.dest('./app'))
    .pipe(livereload());
})

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(['./app/*.html'], ['html']);
//  gulp.watch(['./app/css/*.css'], ['css']);
  gulp.watch(['./app/js/*.js'], ['js']);
  gulp.watch('./app/sass/*.scss', ['sass']);
  gulp.watch('bower.json', ['bower']);
});

gulp.task('default', ['connect', 'watch']);

var gulp = require('gulp')
var plumber = require('gulp-plumber')
var less = require('gulp-less')
var autoprefixer = require('gulp-autoprefixer')
var del = require('del')

gulp.task('misc', function () {
  gulp.src([
    'bower_components/lodash/dist/lodash.min.js',
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/jquery/dist/jquery.min.map',
    'bower_components/jquery.serializeJSON/jquery.serializejson.min.js'
    ])
    .pipe(plumber())
    .pipe(gulp.dest('static/dist'))
})
gulp.task('external', ['misc'])

gulp.task('less', function () {
  gulp.src([
    'src/web/topic-open.less',
    'src/web/topic-view.less'
    ])
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulp.dest('static/dist/app'))
})
gulp.task('js', function () {
  gulp.src([
    'src/web/**/*.js'
    ])
    .pipe(plumber())
    .pipe(gulp.dest('static/dist/app'))
})
gulp.task('source', ['less', 'js'])

gulp.task('clean', function (cb) {
  del([
    'static/dist'
  ], cb)
})
gulp.task('build', ['external', 'source'])

gulp.task('watch', ['build'], function () {
  gulp.watch('src/web/**/*.less', ['less'])
  gulp.watch('src/web/**/*.js', ['js'])
  gulp.watch('src/web/**/*.html', ['html'])
})

gulp.task('default', ['build', 'watch'])

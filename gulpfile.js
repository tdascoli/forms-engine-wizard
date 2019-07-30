var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    header  = require('gulp-header'),
    htmlmin = require('gulp-htmlmin'),
    inject = require('gulp-inject'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    package = require('./package.json');


var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.homepage %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

gulp.task('css', function () {
    return gulp.src('src/scss/style.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('js',function(){
  gulp.src('src/js/scripts.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(uglify())
    .pipe(header(banner, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('ko.js',function(){
  gulp.src('src/js/ko/**/*.js')
    .pipe(concat('ko.formsEngineWizard.min.js'))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest('app/assets/js/ko'))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('templates', function () {
    return gulp.src('./src/templates/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true
        }))
        .pipe(gulp.dest('./app/assets/templates'));
});

gulp.task('inject', function(){
  gulp.src(['./app/*.html'])
    .pipe(inject(gulp.src(['./app/assets/js/**/*.min.js','./app/assets/css/**/*.min.css'], {read: false}), {relative: true}))
    .pipe(gulp.dest('./app'));
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "app"
        }
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['css', 'js', 'ko.js', 'templates', 'inject', 'browser-sync'], function () {
    gulp.watch("src/scss/**/*.scss", ['css']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("src/js/ko/**/*.js", ['ko.js']);
    gulp.watch("app/*.html", ['bs-reload']);
});

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    del = require('del'),
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

// BrowserSync Reload
function reload(done) {
  browserSync.reload();
  done();
}

gulp.task('css', () => {
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

gulp.task('js', () => {
  return gulp.src('src/js/scripts.js')
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

gulp.task('ko.js',() => {
  return gulp.src('src/js/ko/**/*.js')
          .pipe(concat('ko.formsEngineWizard.min.js'))
          .pipe(header(banner, { package : package }))
          .pipe(gulp.dest('app/assets/js/ko'))
          .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('templates', () => {
    return gulp.src('./src/templates/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true
        }))
        .pipe(gulp.dest('./app/assets/templates'))
        .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('inject', () => {
  return gulp.src(['./app/*.html','./app/*.php'])
          .pipe(inject(gulp.src(['./app/assets/components/forms-engine.js/**/*.pagination.min.js',
                                 './app/assets/components/forms-engine.js/**/*.typeahead.css'],
                                {read: false}), {relative: true, name: 'formsEngine'}))
          .pipe(inject(gulp.src(['./app/assets/js/**/*.min.js',
                                 './app/assets/css/**/*.min.css',
                                 './app/assets/components/**/*.min.js',
                                 './app/assets/components/**/*.css',
                                 '!./app/assets/components/forms-engine.js/**/*.pagination.min.js',
                                 '!./app/assets/components/forms-engine.js/**/*.typeahead.css'],
                                 {read: false}), {relative: true}))
          .pipe(gulp.dest('./app'));
});

gulp.task('clean:dependencies', () => {
  return (del(['./app/assets/components/**','!./app/assets/components/']));
});

gulp.task('copy:dependencies', () => {
  var dependencies = Object.keys(package.dependencies);
  var path = Array();
  dependencies.forEach(function(dependency){
    path.push('./node_modules/'+dependency+'/dist/*.js');
    path.push('./node_modules/'+dependency+'/dist/*.css');
  });
  return gulp.src(path,  {base: './node_modules/'})
          .pipe(gulp.dest('./app/assets/components/'));
});

gulp.task('dependencies', gulp.series('clean:dependencies', 'copy:dependencies'));

gulp.task('build', gulp.series('css', 'js', 'ko.js', 'dependencies', 'templates', 'inject'));

gulp.task('watch', function (done) {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
        notify: false});

    gulp.watch("./src/scss/**/*.scss", gulp.series('css'));
    gulp.watch("./src/js/*.js", gulp.series('js'));
    gulp.watch("./src/js/ko/**/*.js", gulp.series('ko.js'));
    gulp.watch("./src/templates/**/*.html", gulp.series('templates'));
    gulp.watch("./app/*.html", reload);
    done();
});

gulp.task('default', gulp.series('build','watch'));

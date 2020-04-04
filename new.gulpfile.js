var gulp        = require('gulp');
var inject      = require('gulp-inject');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var minify      = require('gulp-minifier');
var htmllint    = require('gulp-html');

// Static Server + watching scss/html files
gulp.task('watch', function () {
    browserSync.init({
        server: './app'
    });

    gulp.watch("src/scss/*.scss", gulp.series('sass'));
    gulp.watch("src/scripts/*.js", gulp.series('js'));
    gulp.watch("src/**/*.html", gulp.series('html','inject'));
    gulp.watch(["app/**/*"]).on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/scss/*.scss")
        .pipe(sass())
        .pipe(minify({
          minify: true,
          minifyCSS: true,
          getKeptComment: function (content, filePath) {
              var m = content.match(/\/\*![\s\S]*?\*\//img);
              return m && m.join('\n') + '\n' || '';
          }
        }))
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src('src/**/*.js').pipe(minify({
    minify: true,
    minifyJS: {
      sourceMap: true
    },
    getKeptComment: function (content, filePath) {
        var m = content.match(/\/\*![\s\S]*?\*\//img);
        return m && m.join('\n') + '\n' || '';
    }
  }))
  .pipe(gulp.dest('app'))
  .pipe(browserSync.stream());
});

gulp.task('html', function(){
  return gulp.src('src/*.html')
    .pipe(gulp.dest('app/'))
    .pipe(browserSync.stream());
});

gulp.task('inject', () => {
  return gulp.src(['./app/*.html'])
          .pipe(inject(gulp.src(['./app/**/*.js',
                                 './app/**/*.css'],
                                 {read: false}),
                                 {relative: true}))
          .pipe(gulp.dest('./app'))
          .pipe(browserSync.stream());
});

gulp.task('default', gulp.series('js','sass','html','inject','watch'));

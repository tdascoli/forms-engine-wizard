"use strict";

// Load plugins
const del = require("del");
const gulp = require("gulp");
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const minify = require('gulp-minify');

// Clean assets
function clean() {
  return del(["./dist/"]);
}

// achtung reihenfolge!
function compressElements(){
  return (
    gulp.src([
        'src/FormsEngineJS/questions/type.js',
        'src/FormsEngineJS/questions/element/element.js',
        'src/FormsEngineJS/questions/element/elementGroup.js',
        'src/FormsEngineJS/questions/element/input.js',
        'src/FormsEngineJS/questions/element/text.js',
        'src/FormsEngineJS/questions/element/*'])
      .pipe(concat('formsEngine.js'))
      .pipe(gulp.dest('dist'))
      .pipe(minify({
        ext:{
            min:'.min.js'
        },
        noSource: true
      }))
      .pipe(gulp.dest('dist'))
  );
}

function compressPagination(){
  return (
    gulp.src(['src/FormsEngineJS/pagination/**/*'])
      .pipe(concat('formsEngine.pagination.js'))
      .pipe(gulp.dest('dist'))
      .pipe(minify({
        ext:{
            min:'.min.js'
        },
        noSource: true
      }))
      .pipe(gulp.dest('dist'))
  );
}

// define complex tasks
const js = gulp.series(compressElements, compressPagination);
const build = gulp.series(clean, gulp.parallel(js));

// export tasks
exports.js = js;
exports.clean = clean;
exports.build = build;
exports.default = build;

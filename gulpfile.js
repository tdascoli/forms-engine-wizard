"use strict";

// Load plugins
const del = require("del");
const es = require('event-stream');
const gulp = require("gulp");
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const minify = require('gulp-minify');
const inject = require('gulp-inject');
const copy = require('gulp-copy');

// Clean assets
function clean() {
  return del(["./dist/"]);
}

// inject
function injectJs(){
  return (
    gulp.src(['./dist/*.html','./dist/*.php'])
      .pipe(inject(gulp.src(['./dist/js/*.pagination.min.js'], {read: false}), {relative: true, name: 'pagination'}))
      .pipe(inject(gulp.src(['./dist/js/*.min.js', '!./dist/js/*.pagination.min.js'], {read: false}), {relative: true}))
      .pipe(gulp.dest('./dist'))
  );
}

// js
function allVendorJS(){
  return (
    gulp.src(['./node_modules/forms-engine.js/dist/*.min.js'])
      .pipe(gulp.dest('./dist/js/'))
  );
}

function allSrcJS(){
  return (
    gulp.src(['./src/**/knockout*.js', './src/**/*.js'])
      .pipe(concat('formsEngineWizard.js'))
      .pipe(minify({
        ext:{
            min:'.min.js'
        },
        noSource: true
      }))
      .pipe(gulp.dest('./dist/js/'))
  );
}

// Wizard
function wizard(){
  return (
      gulp.src(['./src/FormsEngineWizard/*'])
        .pipe(gulp.dest('./dist/'))
  );
}
function api(){
  return (
      gulp.src(['./src/FormsEngineWizard/api/**/*'])
        .pipe(gulp.dest('./dist/api'))
  );
}
function templates(){
  return (
      gulp.src(['./src/FormsEngineWizard/templates/**/*'])
        .pipe(gulp.dest('./dist/templates'))
  );
}
function css(){
  return (
      gulp.src(['./src/FormsEngineWizard/css/**/*'])
        .pipe(gulp.dest('./dist/css'))
  );
}

// define complex tasks
const allJs = gulp.series(allSrcJS, allVendorJS);
const injectAllJs = gulp.series(injectJs);
const app = gulp.series(templates, api, css, wizard);
const build = gulp.series(clean, gulp.parallel(allJs, app), injectAllJs);

// export tasks
exports.clean = clean;
exports.build = build;
exports.default = build;

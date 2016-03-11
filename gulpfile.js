'use strict';

const gulp = require('gulp');

const del = require('del');
const eslint = require('gulp-eslint');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');


// options //

const paths = {
  all: ['**/*.js', '!node_modules/', '!node_modules/**', '!coverage/', '!coverage/**', '!public/js/*.min.js'],
  scripts: ['server.js', 'lib/**/*.js'],
  tests: ['test/**/test*.js'],
  unitTests: ['test/unit/**/test*.js'],
  integrationTests: ['test/integration/**/test*.js'],
  coverage: 'coverage',
  clean: ['coverage/', 'node_modules/'],
};

const mochaOpts = {
  reporter: 'spec',
  clearRequireCache: true,
  timeout: 15000,
  ui: 'bdd',
};

const nodemonOpts = {
  script: 'server.js',
  nodeArgs: ['--debug=5861'],
  ext: 'js json',
  delay: 10,
  tasks: ['test-unit'],
};


// tasks //

gulp.task('clean', () => {
  return del(paths.clean);
});


gulp.task('lint', () => {
  return gulp
    .src(paths.all)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


gulp.task('test-unit', ['lint'], () => {
  return gulp
    .src(paths.unitTests)
    .pipe(mocha(mochaOpts));
});


gulp.task('test-integration', ['lint'], () => {
  return gulp
    .src(paths.integrationTests)
    .pipe(mocha(mochaOpts));
});


gulp.task('coverage', () => {
  return gulp
    .src(paths.scripts)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .pipe(gulp.dest(paths.coverage))
    .on('finish', () => {
      gulp.src(paths.unitTests)
        .pipe(mocha(mochaOpts))
        .pipe(istanbul.writeReports());
    });
});


gulp.task('develop', ['test-unit'], () => {
  nodemon(nodemonOpts)
    .on('restart', () => {
      console.log('restarted!');
    });
});


gulp.task('watch', () => {
  gulp.watch(paths.all, ['test-unit']);
});


gulp.task('default', ['test-unit', 'watch']);

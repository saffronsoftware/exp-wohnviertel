/*
Tasks:
  * build
    Build all files
  * watch
    Build all files and watch
Add "--production" to tasks to enable minification.
*/

// > settings
const cssBuildDir = './public/stylesheets/build/'
const cssBuildGroups = [
  {
    dest: 'all.css',
    src: [
      './public/stylesheets/vendor/normalize.css',
      './public/stylesheets/compiled/fonts.css',
      './public/stylesheets/compiled/grid.css',
      './public/stylesheets/compiled/form.css',
      './public/stylesheets/compiled/layout.css',
    ],
  },
]

const jsBuildDir = './public/javascripts/build/'
const jsBuildGroups = [
]
// < settings

import gulp from 'gulp'
import babel from 'gulp-babel'
import plumber from 'gulp-plumber'
import watch from 'gulp-watch'
import concat from 'gulp-concat'
import stylus from 'gulp-stylus'
import nib from 'nib'
import async from 'async'

gulp.task('babel', (done) => {
  gulp
    .src('./app/views/**/*.js')
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest('./public/javascripts/views'))
    .on('end', done)
})

gulp.task('js', ['babel'], (done) => {
  function makeBuildGroup(buildGroup, done) {
    gulp
      .src(buildGroup.src)
      .pipe(plumber())
      .pipe(concat(buildGroup.dest))
      .pipe(gulp.dest(jsBuildDir))
      .on('end', done)
  }

  async.map(jsBuildGroups, makeBuildGroup, done)
})

gulp.task('stylus', (done) => {
  gulp
    .src('./app/stylesheets/**/*.styl')
    .pipe(plumber())
    .pipe(stylus({use: nib(), compress: true}))
    .pipe(gulp.dest('./public/stylesheets/compiled'))
    .on('end', done)
})

gulp.task('css', ['stylus'], (done) => {
  function makeBuildGroup(buildGroup, done) {
    gulp
      .src(buildGroup.src)
      .pipe(plumber())
      .pipe(concat(buildGroup.dest))
      .pipe(gulp.dest(cssBuildDir))
      .on('end', done)
  }

  async.map(cssBuildGroups, makeBuildGroup, done)
})

gulp.task('watch', () => {
  watch('./app/views/**/*.js', () => gulp.start('js'))
  watch('./app/stylesheets/**/*.styl', () => gulp.start('css'))
})

gulp.task('build', ['js', 'css'])
gulp.task('default', ['watch', 'build'])

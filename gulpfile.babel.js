// # Settings

const jsBuildDir = './public/javascripts/build/'
const jsBuildGroups = [
  // {
  //   dest: 'home.js',
  //   src: [
  //     './public/javascripts/views/pages/home/index.js',
  //   ],
  // },
]

const browserifyBuildDir = './public/javascripts/build/'
const browserifyBuildGroups = [
  {
    dest: 'home.js',
    src: [
      './app/frontend/home.js',
    ],
  },
]

// ---

import gulp from 'gulp'
import buffer from 'vinyl-buffer'
import source from 'vinyl-source-stream'
import browserify from 'browserify'
import babelify from 'babelify';
import babel from 'gulp-babel'
import plumber from 'gulp-plumber'
import watch from 'gulp-watch'
import concat from 'gulp-concat'
import stylus from 'gulp-stylus'
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

gulp.task('browserify', (done) => {
  function makeBuildGroup(buildGroup, done) {
    var b = browserify({
      entries: buildGroup.src,
      debug: true,
    })

    return b
      .transform(babelify)
      .bundle()
      .on('error', done)
      .pipe(source(buildGroup.dest))
      .pipe(buffer())
      .pipe(gulp.dest(browserifyBuildDir))
      .on('end', done)
  }

  async.map(browserifyBuildGroups, makeBuildGroup, done)
})

gulp.task('stylus', (done) => {
  gulp
    .src('./app/stylesheets/**/*.styl')
    .pipe(plumber())
    .pipe(stylus({compress: true}))
    .pipe(gulp.dest('./public/stylesheets/compiled'))
    .on('end', done)
})

gulp.task('watch', () => {
  watch('./app/views/**/*.js', () => gulp.start('js'))
  watch('./app/frontend/**/*.js', () => gulp.start('browserify'))
  watch('./app/stylesheets/**/*.styl', () => gulp.start('stylus'))
})

gulp.task('build', ['js', 'stylus', 'browserify'])
gulp.task('default', ['watch', 'build'])

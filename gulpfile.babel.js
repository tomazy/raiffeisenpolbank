'use strict'

import gulp from 'gulp'
import pug from 'gulp-pug'
import sass from 'gulp-sass'
import path from 'path'

import ratesTasks from './gulp/rates'
import cnameTasks from './gulp/cname'
import dataTasks from './gulp/data'

const DEST = path.resolve(__dirname, 'dist')

const SASS_GLOB = 'website/**/*.scss'

ratesTasks({ DEST })
cnameTasks({ DEST })
dataTasks({ DEST })

gulp.task('css', () => (
  gulp.src(SASS_GLOB)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(DEST))
))

gulp.task('css:watch', () => (
  gulp.watch(SASS_GLOB, ['css'])
))

gulp.task('html:website:index', () => (
  gulp.src('website/index.pug')
    .pipe(pug({
      basedir: 'website'
    }))
    .pipe(gulp.dest(DEST))
))

const thisYear = new Date().getFullYear()
const firstYear = 2007
const years = Array.from({ length: (thisYear - firstYear + 1) }, (_, idx) => firstYear + idx)

gulp.task('html', [
  'html:website:index',
  'html:website:kursy:index',
  ...years.map(year => `html:website:kursy:${year}`)
])

gulp.task('html:watch', () => (
  gulp.watch('website/**/*.pug', ['html'])
))

gulp.task('default', [
  'css',
  'html',
  'data',
  'cname'
])

gulp.task('watch', ['html:watch', 'css:watch'])

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

gulp.task('html', [
  'html:website:index',
  'html:website:kursy:index',
  'html:website:kursy:2007',
  'html:website:kursy:2008',
  'html:website:kursy:2009',
  'html:website:kursy:2010',
  'html:website:kursy:2011',
  'html:website:kursy:2012',
  'html:website:kursy:2013',
  'html:website:kursy:2014',
  'html:website:kursy:2015',
  'html:website:kursy:2016',
  'html:website:kursy:2017'
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

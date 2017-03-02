'use strict'

import gulp from 'gulp'
import path from 'path'
import concat from 'gulp-concat'
import transform from 'gulp-transform'

function removeLinksFromCSV (content) {
  return content.toString('utf-8').split('\n')
    .map(rowStr => (
      rowStr.split(',').slice(0, -1).join(',')
    ))
    .join('\n')
    .trim()
}

export default function defineTasks ({ DEST }) {
  gulp.task('data', ['data:every', 'data:all'])

  gulp.task('data:every', () => (
    gulp.src('data/*.csv')
      .pipe(gulp.dest(path.join(DEST, 'data')))
  ))

  gulp.task('data:all', () => (
    gulp.src('data/20??.csv')
      .pipe(transform(removeLinksFromCSV))
      .pipe(concat('chf.csv'))
      .pipe(gulp.dest(path.join(DEST, 'data')))
  ))
}

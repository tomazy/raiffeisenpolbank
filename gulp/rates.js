import gulp from 'gulp'
import pug from 'gulp-pug'
import padRight from 'pad-right'
import path from 'path'
import fs from 'fs'
import glob from 'glob'
import rename from 'gulp-rename'

const CSV_FILES = glob.sync('data/*.csv')

const BUY_INDEX = 2
const SELL_INDEX = 3

function fixPrice (price) {
  return padRight(price, 6, '0')
}

function fixCell (cell, idx) {
  return (idx === BUY_INDEX || idx === SELL_INDEX) ? fixPrice(cell) : cell
}

function loadCSV (filename) {
  return fs.readFileSync(filename, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map(
      (s, idx) => [idx + 1, ...s.split(',').map(fixCell)]
    )
}

function basename (f) {
  const parts = f.split('/')
  const name = parts[parts.length - 1]
  return name.split('.')[0]
}

const RATES_TABLE_HEADERS = [{
  title: '#',
  class: 'rowNumber'
}, {
  title: 'Data',
  class: 'date'
}, {
  title: 'Godzina',
  class: 'hour'
}, {
  title: 'Kupno',
  class: 'buy'
}, {
  title: 'Sprzedaż',
  class: 'sell'
}, {
  title: 'Link',
  class: 'link'
}]

export default function defineTasks ({ DEST }) {
  gulp.task('html:website:kursy:index', () => {
    gulp.src('website/kursy/index.pug')
      .pipe(pug({
        basedir: 'website',
        locals: {
          years: CSV_FILES.map(basename)
        }
      }))
      .pipe(gulp.dest(path.join(DEST, 'kursy')))
  })

  CSV_FILES.forEach(filename => {
    const year = basename(filename)
    const rows = loadCSV(filename)

    gulp.task(`html:website:kursy:${year}`, () => {
      gulp.src('website/kursy/year.pug')
        .pipe(pug({
          basedir: 'website',
          pretty: true,
          locals: {
            year,
            headers: RATES_TABLE_HEADERS,
            rows
          }
        }))
        .pipe(rename(`${year}.html`))
        .pipe(gulp.dest(path.join(DEST, 'kursy')))
    })
  })
}

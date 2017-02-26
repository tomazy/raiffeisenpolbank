import pug from 'pug'
import path from 'path'
import fs from 'fs'
import padRight from 'pad-right'

const argv = process.argv.slice(2)

const TEMPLATE_PATH = path.resolve(__dirname, '../website/kursy/year.pug')
const DATA_DIR = path.resolve(__dirname, '../data')

const compileOptions = {
  basedir: path.resolve(__dirname, '../website'),
  pretty: true
}
const compiled = pug.compileFile(TEMPLATE_PATH, compileOptions)

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

function main (argv) {
  const [year] = argv

  const csvFileName = path.join(DATA_DIR, `${year}.csv`)
  const rows = loadCSV(csvFileName)

  const html = compiled({
    year,
    headers: [{
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
    }],
    rows
  })

  console.log(html)
}

main(argv)

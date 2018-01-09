import invariant from 'invariant'
import request from './lib/cachedRequestPromise'

const REQUEST_TIMEOUT = 30 * 1000

const debug = require('debug')('nbp') // eslint-disable-line no-unused-vars

function buildQuery (year) {
  const d = new Date()
  if (d.getFullYear() === +year) {
    return new Date(year, d.getMonth(), d.getDate()).toISOString()
  } else {
    return `${year}-12-31T00:00:00.000Z`
  }
  return ''
}

function buildUrlAvg (year) {
  const baseUrl = `https://www.nbp.pl/kursy/Archiwum/archiwum_tab_a_${year}.csv`
  return baseUrl + '?' + buildQuery(year)
}

function buildUrlAvgSell (year) {
  const baseUrl = `https://www.nbp.pl/kursy/Archiwum/Archiwum_sprzedaz_Tab_C_${year}.csv`
  return baseUrl + '?' + buildQuery(year)
}

const DATE_REGEX = /^(\d{4})(\d{2})(\d{2})$/

function csvParser (fieldName) {
  let rowNr = -1
  let chfColumn
  let done

  return function parseRow (row) {
    rowNr++

    if (done) {
      return
    }

    const cells = row.split(';')

    if (rowNr === 0) {
      chfColumn = cells.findIndex(c => c.match(/chf/i))
      return
    }

    if (rowNr === 1) {
      return // skip
    }

    if (cells.length < 2) {
      done = true
      return
    }

    const date = cells[0].match(DATE_REGEX).slice(1).join('-')
    const chf = parseFloat(cells[chfColumn].replace(',', '.'))
    return {
      [fieldName]: chf,
      date
    }
  }
}

function parseCsv (chfFieldName, csv) {
  const parse = csvParser(chfFieldName)
  const lines = csv.split('\n')
  return lines.reduce((a, e) => {
    const item = parse(e)

    if (item) {
      invariant(!a[item.date], `a[${item.date}] already exists!`)
      a[item.date] = item
    }

    return a
  }, {})
}

const parseAvg = parseCsv.bind(null, 'avg')
const parseAvgSell = parseCsv.bind(null, 'avg_sell')

function merge ([ob1, ob2]) {
  return Object.keys(ob1).reduce((a, e) => {
    const o = Object.assign({}, ob1[e], ob2[e])
    return Object.assign(a, { [e]: o })
  }, {})
}

function print (merged) {
  const keys = Object.keys(merged).sort()
  const header = ['data', 'kurs średni', 'kurs sprzedaży']
  console.log(header.join(','))
  keys.forEach(date => {
    const o = merged[date]
    const row = [date, o.avg, o.avg_sell]
    console.log(row.join(','))
  })
}

const usage = `
Usage:
  npm -s run nbp -- 2017
`

function requestOptions (url) {
  return {
    url,
    timeout: REQUEST_TIMEOUT
  }
}

function main () {
  let [year] = process.argv.slice(2)

  if (!year) {
    console.log(usage)
    process.exit(1)
  }

  debug('year', year)

  const urlAvg = buildUrlAvg(year)
  const urlAvgSell = buildUrlAvgSell(year)

  Promise.all([
    request(requestOptions(urlAvg)).then(parseAvg),
    request(requestOptions(urlAvgSell)).then(parseAvgSell)
  ])
  .then(merge)
  .then(print)
  .catch(e => {
    console.error(e)
    process.exit(2)
  })
}

main()

import * as shell from 'shelljs'
import * as path from 'path'
import startOfYesterday from 'date-fns/start_of_yesterday'
import format from 'date-fns/format'

shell.config.fatal = true // set -e
shell.config.silent = true

const debug = require('debug')('update-rates')

const DATE_FORMAT = 'YYYY-MM-DD'
const yesterday = format(startOfYesterday(), DATE_FORMAT)

const year = process.env.YEAR || (new Date()).getFullYear()
const dataDir = path.resolve('data')

function fetchBankRates () {
  const ratesPath = path.join(dataDir, `${year}.csv`)
  debug('bank rates file', ratesPath)

  shell
    .exec(`npm -s run bank -- ${year}`)
    .exec('sort')
    .exec('uniq')
    .to(ratesPath)
}

function fetchLibor () {
  const ratesPath = path.join(dataDir, `libor-3m-chf-${year}.csv`)
  debug('libor rates file', ratesPath)

  shell
    .exec(`npm run -s libor -- ${year}-01-01 ${yesterday}`)
    .to(ratesPath)
}

function fetchNBP () {
  const ratesPath = path.join(dataDir, `nbp-${year}.csv`)
  debug('nbp rates file', ratesPath)

  shell
    .exec(`npm run -s nbp -- ${year}`)
    .to(ratesPath)
}

fetchBankRates()
fetchLibor()
fetchNBP()

debug('done!')

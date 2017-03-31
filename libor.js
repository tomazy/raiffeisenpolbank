import qs from 'qs'
import request from './lib/cachedRequestPromise'

const REQUEST_TIMEOUT = 30 * 1000

const debug = require('debug')('fetch-libor') // eslint-disable-line no-unused-vars

function buildUrl (fromDate, toDate) {
  const baseUrl = 'https://fred.stlouisfed.org/graph/fredgraph.csv'
  const query = {
    cosd: fromDate,
    coed: toDate,
    id: 'CHF3MTD156N'
  }

  return baseUrl + '?' + qs.stringify(query)
}


const usage = `
Usage:
  npm -s run libor -- 2017-01-02 2017-03-31
`
function main () {
  let [fromDate, toDate] = process.argv.slice(2)

  if (!fromDate || !toDate) {
    console.log(usage)
    process.exit(1)
  }

  debug('fromDate', fromDate)
  debug('toDate', toDate)

  const url = buildUrl(fromDate, toDate)
  request({ url, timeout: REQUEST_TIMEOUT }).then(data => {
    console.log(data.trimRight())
  })
}

main()

import request from './lib/cachedRequestPromise'
import polbankScraper from './lib/scrapers/polbankExchangeRatesScraper'
import raiffeisenScraper from './lib/scrapers/raiffeisenExchangeRatesScraper'
import createExecutor from './lib/jobs'
import { incDay, formatDate, isWeekend, callIf } from './lib/utils'

const LAST_POLBANK_EXCHANGE_RATE_DATE = Date.parse('2014-05-20')
const CONCURRENCY = process.env.CONCURRENCY || 20
const CURRENCY = process.env.CURRENCY || 'CHF'
const REQUEST_TIMEOUT = 30 * 1000

const debug = require('debug')('main') // eslint-disable-line no-unused-vars

const KEYS = [
  'date',
  'time',
  'buy',
  'sell',
  'url'
]

function csvPrint (rates) {
  console.log(KEYS.map(k => rates[k]).join(','))
}

const executor = createExecutor(CONCURRENCY, function execJob ({ date, time, print }) {
  return scrape(date, time, print)
})

function jobKey (date, time) {
  return `${date} ${time}`
}

const scheduledKeys = {}
function schedule (date, time = null, print) {
  const key = jobKey(date, time)

  if (scheduledKeys[key]) {
    return
  }

  debug('schedule', date, time)

  scheduledKeys[key] = true

  const job = { date, time, print }
  executor.schedule(job, !!time)
}

function getScraper (date) {
  return Date.parse(date) > LAST_POLBANK_EXCHANGE_RATE_DATE
    ? raiffeisenScraper
    : polbankScraper
}

async function scrape (date, time, print) {
  const s = getScraper(date)(CURRENCY)
  const url = s.url(date, time)

  const html = await request({ url, timeout: REQUEST_TIMEOUT })

  const [rates, otherTimes] = s.parse(html)

  debug('rates', rates)
  debug('other times', otherTimes)

  print(rates)

  otherTimes.forEach(t => schedule(rates.date, t, print))
}

function scrapePeriod (fromDate, toDate) {
  const print = callIf(csvPrint, ({ date }) => {
    const d = new Date(date)
    return (fromDate <= d && d < toDate)
  })

  let date = fromDate
  while (date < toDate) {
    if (!isWeekend(date)) {
      schedule(formatDate(date), null, print)
    }
    date = incDay(date)
  }
}

const usage = `
Usage:
  npm -s start -- 2007-01-02 2007-01-10
or
  npm -s start -- 2017 # scrapes from 2017-01-01 up to yesterday
`
function main () {
  let [fromDate, toDate] = process.argv.slice(2)

  if (/^\d{4}$/.test(fromDate)) {
    fromDate = `${fromDate}-01-01`
    toDate = formatDate(new Date())
  }

  if (!fromDate || !toDate) {
    console.log(usage)
    process.exit(1)
  }

  debug('fromDate', fromDate)
  debug('toDate', toDate)

  scrapePeriod(
    new Date(fromDate),
    new Date(toDate)
  )
}

main()


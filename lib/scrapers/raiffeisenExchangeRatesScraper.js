import qs from 'qs'
import cheerio from 'cheerio'

const debug = require('debug')('raiffeisenExchangeRatesScraper') // eslint-disable-line no-unused-vars

const BASE_URL = 'http://raiffeisenpolbank.com/kursy-walut/kursy-walut-dla-produktow-hipotecznych-mg/-/amg-currency-simple-box/date'

function dateParam (date) {
  return {
    _amgcurrencysimplelist_WAR_amgcurrencyportlet_rateDate: date
  }
}

function timeParam (time) {
  if (!time) return {}
  return {
    _amgcurrencysimplelist_WAR_amgcurrencyportlet_rateTime: time
  }
}

function paramsForDateTime (date, time) {
  return {
    ...dateParam(date),
    ...timeParam(time)
  }
}

function parseRates ($tr) {
  const $tds = $tr.find('td')
  const buy = parseFloat($tds.eq(2).text())
  const sell = parseFloat($tds.eq(3).text())
  return {
    buy,
    sell
  }
}

function url (date, time) {
  return `${BASE_URL}?${qs.stringify(paramsForDateTime(date, time))}`
}

export default function polbankExchangeRateScraper (currency) {
  const CURRENCY_RE = new RegExp(currency)

  return {
    parse (html) {
      debug('parseDocument')

      let time = null
      let rates = {}

      const $ = cheerio.load(html)
      const $form = $('form#currencies-table-form')

      const hours = $form.find('th.col-2 ul.hours li').map((i, e) => $(e).text()).toArray()
      debug('hours', hours)

      if (hours.length) {
        time = $form.find('th.col-2 ul.hours li.selected').text()
      }

      debug('time', time)

      const date = $form.find('.datepicker').val()
      debug('date', date)

      const $tr = $form.find('table.default.stock tr').filter((i, el) => $(el).text().match(CURRENCY_RE))
      if ($tr.length === 1) rates = parseRates($tr)

      return [{
        ...rates,
        date,
        time,
        url: url(date, time)
      }, hours.filter(h => h !== time)]
    },

    url
  }
}

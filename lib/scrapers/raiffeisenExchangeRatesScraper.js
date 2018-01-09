import qs from 'qs'

const debug = require('debug')('raiffeisen-2') // eslint-disable-line no-unused-vars

const BASE_URL = 'https://raiffeisenpolbank.com/Quot/get'

function paramsForDateTime (date) {
  return {
    type: 'kursy walut',
    date,
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

function url (date) {
  return `${BASE_URL}?${qs.stringify(paramsForDateTime(date))}`
}

export default function exchangeRateScraper (currency) {
  const CURRENCY_RE = new RegExp(currency)

  return {
    parse (doc) {
      debug('parsing', doc)

      const parsed = JSON.parse(doc)
      const ratesHours = parsed.rates_hours

      const selectedHour = ratesHours && ratesHours.length
        ? ratesHours[ratesHours.length - 1]
        : null;

      const rates = parsed.rates
        .filter(r => r.code === 'CHF')
        // tylko kursy z pierwszej godziny są wyświetlane na stronie Raiffeisen
        .filter(r => selectedHour
          ? r.ratetime === selectedHour
          : true
        )
        .map(({ buyrate, sellrate, ratedate, ratetime }) => ({
          date: ratedate,
          time: ratetime,
          sell: sellrate,
          buy: buyrate,
          url: url(ratedate)
        })).sort((a, b) => a.time.localeCompare(b.time))

      return [rates, []];
    },

    url
  }
}

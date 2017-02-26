import invariant from 'invariant'

export function incDay (date) {
  invariant(date instanceof Date, 'arg should be a Date')

  const result = new Date(date)
  result.setDate(date.getDate() + 1)
  return result
}

function zeroPad (number) {
  return (number < 10) ? `0${number}` : number + ''
}

export function formatDate (d) {
  return [
    d.getFullYear(),
    zeroPad(d.getMonth() + 1),
    zeroPad(d.getDate())
  ].join('-')
}

export function isWeekend (date) {
  return date.getDay() === 6 || date.getDay() === 0
}

export function callIf (fn, predicate) {
  return function (...args) {
    if (predicate(...args)) fn(...args)
  }
}

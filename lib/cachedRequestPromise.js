import request from 'request-promise'
import path from 'path'
import makeCache from './fileCache'

const debug = require('debug')('cachedRequestPromise') // eslint-disable-line no-unused-vars

const cache = makeCache(path.resolve(__dirname, '../.cache'))

export default async function req (options) {
  const { url } = options

  const cached = cache.get(url)
  if (cached) return cached

  debug('cache miss')

  const value = await request({ gzip: true, ...options })
  cache.put(url, value)
  return value
}

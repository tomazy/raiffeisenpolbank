import md5 from 'md5'
import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'

const debug = require('debug')('fileCache') // eslint-disable-line no-unused-vars

const hash = md5

export default function cache (dir) {
  mkdirp.sync(dir)

  return {
    get (key) {
      debug('get', key)

      const hashed = hash(key)
      debug('hashed', hashed)

      const p = path.join(dir, hashed)
      if (fs.existsSync(p)) {
        return fs.readFileSync(p, { encoding: 'utf8' })
      }
      return undefined
    },

    put (key, value) {
      debug('put', key)

      const hashed = hash(key)
      const p = path.join(dir, hashed)
      fs.writeFileSync(p, value)
    }
  }
}

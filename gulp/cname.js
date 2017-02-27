import gulp from 'gulp'
import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'

const CNAME = 'raiffeisenpolbank.tomazy.com'

export default function defineTasks ({ DEST }) {
  gulp.task('cname', cb => (
    mkdirp(DEST, (err) => {
      if (err) return cb(err)
      fs.writeFile(path.join(DEST, 'CNAME'), `${CNAME}\n`, cb)
    })
  ))
}

import pug from 'pug'
import path from 'path'
import fs from 'fs'
import glob from 'glob'

const argv = process.argv.slice(2)

const TEMPLATE_PATH = path.resolve(__dirname, '../website/kursy/index.pug')
const DATA_DIR = path.resolve(__dirname, '../data')

const compileOptions = {
  basedir: path.resolve(__dirname, '../website'),
  pretty: true
}

const compiled = pug.compileFile(TEMPLATE_PATH, compileOptions)

function basename (f) {
  const parts = f.split('/')
  const name = parts[parts.length - 1]
  return name.split('.')[0]
}

function getYears () {
  const p = path.join(DATA_DIR, '*.csv')
  return glob.sync(p).map(basename)
}

function main (argv) {
  const years = getYears()

  const html = compiled({
    years
  })

  console.log(html)
}

main(argv)

#!/bin/bash
# set -x
set -e

DEST=gh-pages

mkdir -p $DEST

echo 'Generate css'
npm -s run sass --  website/styles.scss ${DEST}/styles.css

echo 'Generating year pages'
rm -fr ${DEST}/kursy
mkdir -p ${DEST}/kursy

for i in $(ls data/2*.csv)
do
  y=`basename $i .csv`
  echo "... ${y}"
  npm -s run b scripts/genYearPage.js -- ${y} > ${DEST}/kursy/${y}.html
done

echo 'Generate "kursy" index'
npm -s run b scripts/genKursyIndex.js > ${DEST}/kursy/index.html

echo 'Generate index'
npm -s run pug -- --basedir website < website/index.pug > ${DEST}/index.html
